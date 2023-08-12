import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import web3Utils from "web3-utils"

const {fromWei, toBN} = web3Utils
const {normalize} = require('../utils.js');

const CLF_API_URL = 'https://api.la-tribu.xyz/dexhistory/getallCLFs';

const getToday = ()=> {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const today = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`
  return today
}

class MainStore {

  loadedFiles = [];
  loadedFilesDate = Date.now();
  headDirectory = 'bad-debt'
  multiResultPlatforms = [];
  tableData = []
  tableRowDetails = null
  loading = true
  CLFs = null;
  blackMode =  null
  badDebtCache = {}
  badDebtSubJobsCache = {}
  today = getToday()
  oldestDay = '2022-10-24'
  selectedDate = getToday()
  initializationPromise = null
  badDebtSha = null

  constructor () {
    makeAutoObservable(this)

    const urlParams = new URLSearchParams(window.location.search);
    const staging = urlParams.get('staging')

    if(staging && staging.toLowerCase() === 'true') {
      this.headDirectory = 'bad-debt-staging'
    }

    this.initializationPromise = this.init()
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      this.blackMode = true
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.blackMode = !!e.matches
    });
  }

  get githubDirName () {
    if(this.selectedDate === this.today) {
      return 'latest'
    }
    const [year, month, day] = this.selectedDate.split('-')
    const dirName = `${parseInt(day)}.${parseInt(month)}.${year}`
    return dirName
  }

  setSelectedDate = (e) => {
    this.selectedDate = e.target.value
    this.initializationPromise = this.init()
  }

  setBlackMode = (mode) => {
    this.blackMode = mode
  }

  getJsonFile = async (fileName, combinedMarkets) => {
    const { data: file } = await axios.get(`https://raw.githubusercontent.com/Risk-DAO/simulation-results/main/${this.headDirectory}/${this.githubDirName}/${encodeURIComponent(fileName)}`)
    if(!file) return
    const platform = fileName.replace('.json', '').split('_')[1]
    if(fileName.indexOf('subjob') === -1 && !combinedMarkets.includes(platform)){
      this.badDebtCache[fileName.replace('.json', '')] = file
    } else {
      const key = fileName.replace('.json', '').replace('subjob', '')
      if(!this.badDebtSubJobsCache[platform]) {
        this.badDebtSubJobsCache[platform] = {};
      }
      const platformSubJobs = this.badDebtSubJobsCache[platform];
      file['sourceFile'] = fileName;
      platformSubJobs[key] = file
    }
  }

  // this method get all github files for the repository using the recursive API
  // and then save all files into 'this.loadedFiles'
  // it helps reduce the number of calls to github which can "rate limit" users
  getCachedFiles = async () => {
    // only load files from github if:
    // - no files loaded
    // - last load date is greater than 10 minutes ago
    if(this.loadedFiles.length === 0 || (Date.now() - this.loadedFilesDate) > 10 * 60 * 1000) {
      console.log('getFileNames: loading files from github');
      const allDirs = await axios.get('https://api.github.com/repos/Risk-DAO/simulation-results/git/trees/main?recursive=1');
      this.loadedFiles = allDirs.data.tree.map(_ => _.path);
      this.loadedFilesDate = Date.now();  
      console.log(`getFileNames: loaded ${this.loadedFiles.length} files from github`);
    } else {
      console.log(`getFileNames: getting files from cache`);
    }

    console.log(`getFileNames: returning ${this.loadedFiles.length} files`);
    return this.loadedFiles;
  }

  getFileNames = async () => {
    const dirToGet = this.headDirectory + '/' + this.githubDirName + '/';
    const selectedFiles = (await this.getCachedFiles()).filter(_ => _.startsWith(dirToGet))
    return selectedFiles.map(_ => _.split('/').slice(-1)[0]);
  }

  badDebtFetcher = async () => {
    try{
      const fileNames = await this.getFileNames()
      this.multiResultPlatforms = this.getMultiResultPlatforms(fileNames);
      console.log('multiResultPlatforms', this.multiResultPlatforms)
      const filePromises = fileNames.map(_ => this.getJsonFile(_, this.multiResultPlatforms))
      await Promise.all(filePromises)
      console.log('badDebtCache done')
    } catch (err) {
      console.error(err)
    }
  }

  getCLFs = async () => {
    try{
    const CLFs = await axios.get(CLF_API_URL);
    this.CLFs = CLFs;
  }
  catch(err){
    console.log("Could not get CLFs");
    console.log(err);
    this.CLFs = undefined;
  }
  }

  getMultiResultPlatforms = (fileNames) => {
    const platformsCount = [];
    fileNames.forEach(filename => {
      const platform = filename.replace('.json', '').split('_')[1]
      const indexOfPlatform = platformsCount.findIndex(_ => _.platform === platform);
      if(indexOfPlatform >= 0) {
        platformsCount[indexOfPlatform].counter++;
        // console.log('new value for platform', platform, ':', platformsCount[indexOfPlatform].counter)
      } else {
        platformsCount.push({
          platform: platform,
          counter: 1,
        })
        // console.log('Adding new platform with counter 1 for platform', platform);
      }      
    });

    // return all platform with more than 1 in the counter field
    return platformsCount.filter(_ => _.counter > 1).map(_ => _.platform);
  }

  clearCache = () => {
    this.badDebtCache = {}
    this.badDebtSubJobsCache = {}
  }

  init = async () => {
    runInAction(()=> this.loading = true)
    this.clearCache()
    await this.badDebtFetcher()
    await this.getCLFs()
    const subJobs = this.badDebtSubJobsCache
    const subJobSummeries = Object.entries(subJobs).map(this.summarizeSubJobs)
    const badDebt = this.badDebtCache
    
    const rows = Object.entries(badDebt).map(([k, v])=> {
      const [chain, platform, market] = k.split('_')
      let {total, updated, users, decimals, tvl, clf} = v
      const totalDebt = Math.abs(normalize(total, decimals))
      tvl = Math.abs(normalize(tvl, decimals));
      return {
        platform,
        chain,
        tvl,
        total: totalDebt,
        ratio: 100 * (totalDebt/tvl),
        updated,
        clf,
        users,
      }
    })
    
    runInAction(() => {
      console.log('subJobSummeries', subJobSummeries);
      this.tableData = rows.concat(subJobSummeries)
      this.loading = false
    })
    
    this.sortBy("tvl")
  }

  sortBy(sortAttribute){
    this.tableData = this.tableData.slice().sort((a, b) => {
      return Number(b[sortAttribute]) - Number(a[sortAttribute])
    })
  }

  openTableRowDetails = (name)=> {
    if(this.tableRowDetails === name){
      this.tableRowDetails = null
      return
    }
    this.tableRowDetails = name
  }

  summarizeSubJobs = ([platform, markets]) => {
    const chain = [...new Set(Object.keys(markets).map(market => market.split('_')[0]))].join(',')
    const tvl = Math.abs(Object.values(markets).reduce((acc, market) => acc + normalize(market.tvl, market.decimals), 0))
    const total = Math.abs(Object.values(markets).reduce((acc, market) => acc + normalize(market.total, market.decimals), 0))
    const updated = Object.values(markets).map(({updated})=> updated).sort((a, b)=> Number(a) - Number(b))[0]
    const clf = this.CLFs ? Object.values(this.CLFs).map((_) => _.protocol === "platform" ? this.CLFs.plateform : undefined) : undefined ;
    const users = [].concat(...Object.values(markets).map(({users}) => users))

    return {
      platform,
      chain,
      tvl,
      total: total,
      ratio: 100 * (total/tvl),
      updated,
      users,
      clf,
      markets
    }
  }
}

export default new MainStore()
