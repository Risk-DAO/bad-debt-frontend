import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import web3Utils from "web3-utils"

const {fromWei, toBN} = web3Utils

const getToday = ()=> {
  const dateObj = new Date();
  const month = dateObj.getUTCMonth() + 1; //months from 1-12
  const day = dateObj.getUTCDate();
  const year = dateObj.getUTCFullYear();
  const today = `${year}-${month > 9 ? month : '0' + month}-${day > 9 ? day : '0' + day}`
  return today
}

class MainStore {

  headDirectory = 'bad-debt'
  tableData = []
  tableRowDetails = null
  loading = true
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

    if(process.env.NODE_ENV === 'development') {
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
      platformSubJobs[key] = file
    }
  }

  getFileNames = async () => {
    const dirToGet = this.headDirectory + '/' + this.githubDirName + '/';
    const allDirs = await axios.get('https://api.github.com/repos/Risk-DAO/simulation-results/git/trees/main?recursive=1');
    const selectedFiles = allDirs.data.tree.filter(_ => _.path.startsWith(dirToGet))
    return selectedFiles.map(_ => _.path.split('/').slice(-1)[0]);
  }

  badDebtFetcher = async () => {
    try{
      const fileNames = await this.getFileNames()
      const multiResultPlatforms = this.getMultiResultPlatforms(fileNames);
      console.log('multiResultPlatforms', multiResultPlatforms)
      const filePromises = fileNames.map(_ => this.getJsonFile(_, multiResultPlatforms))
      await Promise.all(filePromises)
      console.log('badDebtCache done')
    } catch (err) {
      console.error(err)
    }
  }

  getMultiResultPlatforms = (fileNames) => {
    const platformsCount = [];
    fileNames.forEach(filename => {
      const platform = filename.replace('.json', '').split('_')[1]
      const indexOfPlatform = platformsCount.findIndex(_ => _.platform = platform);
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
    const subJobs = this.badDebtSubJobsCache
    const subJobSummeries = Object.entries(subJobs).map(this.summarizeSubJobs)
    const badDebt = this.badDebtCache
    
    const rows = Object.entries(badDebt).map(([k, v])=> {
      const [chain, platform, market] = k.split('_')
      let {total, updated, users, decimals, tvl} = v
      const totalDebt = Math.abs(normalize(total, decimals))
      tvl = Math.abs(normalize(tvl, decimals));
      return {
        platform,
        chain,
        tvl,
        total: totalDebt,
        ratio: 100 * (totalDebt/tvl),
        updated,
        users,
      }
    })
    
    runInAction(() => {
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
    let tvl = (Object.values(markets).reduce((acc, market) => toBN(acc).add(toBN(market.tvl)), '0')).toString()
    let total = (Object.values(markets).reduce((acc, market) => toBN(acc).add(toBN(market.total)), '0')).toString()
    let {decimals} = Object.values(markets)[0]
    const totalDebt = Math.abs(normalize(total, decimals));
    tvl = Math.abs(normalize(tvl, decimals))
    let updated = Object.values(markets).map(({updated})=> updated).sort((a, b)=> Number(a) - Number(b))[0]
    let users = [].concat(...Object.values(markets).map(({users}) => users))

    return {
      platform,
      chain,
      tvl,
      total: totalDebt,
      ratio: 100 * (totalDebt/tvl),
      updated,
      users,
      markets
    }
  }
}

function normalize(amount, decimals) {
  if(decimals === 18) {
      return  Number(fromWei(amount))
  }
  else if(decimals > 18) {
    const factor = toBN("10").pow(toBN(decimals - 18))
    const norm = toBN(amount.toString()).div(factor)
    return Number(fromWei(norm))
  } else {
      const factor = toBN("10").pow(toBN(18 - decimals))
      const norm = toBN(amount.toString()).mul(factor)
      return Number(fromWei(norm))
  }
}

export default new MainStore()
