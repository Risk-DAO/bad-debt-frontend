import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import web3Utils from "web3-utils"

const {fromWei, toBN} = web3Utils

const deciamlNameMap = Object.assign({}, ...Object.entries(web3Utils.unitMap).map(([a,b]) => ({ [b]: a })))

class MainStore {

  tableData = []
  tableRowDetails = null
  loading = true
  isLocalHost = window.location.hostname === 'localhost'
  blackMode =  null
  badDebtCache = {}
  badDebtSubJobsCache = {}

  constructor () {
    makeAutoObservable(this)
    this.initializationPromise = this.init()
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      // dark mode
      this.blackMode = true
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
      this.blackMode = !!e.matches
    });
  }

  setBlackMode = (mode) => {
    this.blackMode = mode
  }

  getJsonFile = async fileName => {
    const { data: file } = await axios.get(`https://raw.githubusercontent.com/Risk-DAO/simulation-results/main/bad-debt/latest/${encodeURIComponent(fileName)}`)
    if(!file) return
    if(fileName.indexOf('subjob') === -1){
      this.badDebtCache[fileName.replace('.json', '')] = file
    } else {
      const key = fileName.replace('.json', '').replace('subjob', '')
      const platform = key.split('_')[1]
      const platformSubJobs = this.badDebtSubJobsCache[platform] = this.badDebtSubJobsCache[platform] || {}
      platformSubJobs[key] = file
    }
  }

  getFileNames = () => {
    return axios.get('https://api.github.com/repos/Risk-DAO/simulation-results/git/trees/f63242689a16f32c4afdeaf5252f3bf47875f5a7')
    .then(({data})=> {
      return data.tree.map(({path}) => path)
    })
  }

  badDebtFetcher = async () => {
    try{
      const fileNames = await this.getFileNames()
      const filePromises = fileNames.map(this.getJsonFile)
      await Promise.all(filePromises)
      console.log('badDebtCache done')
    } catch (err) {
      console.error(err)
    }
  }

  init = async () => {
    await this.badDebtFetcher()
    const subJobs = this.badDebtSubJobsCache
    const subJobSummeries = Object.entries(subJobs).map(this.summrizeSubJobs)
    const badDebt = this.badDebtCache
    
    const rows = Object.entries(badDebt).map(([k, v])=> {
      const [chain, platform, market] = k.split('_')
      let {total, updated, users, decimals, tvl} = v
      if(Number(decimals) > 31){
        const denominator = toBN('10').pow(toBN((Number(decimals) - 18).toString()))
        total = toBN(total).div(denominator).toString()
        tvl = toBN(tvl).div(denominator).toString()
        decimals = 18
      }
      const decimalName = deciamlNameMap[Math.pow(10, decimals).toString()]
      const totalDebt = Math.abs(parseFloat(fromWei(total, decimalName)))
      tvl = Math.abs(parseFloat(fromWei(tvl, decimalName)))
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

  summrizeSubJobs = ([platform, markets]) => {
    const chain = [...new Set(Object.keys(markets).map(market => market.split('_')[0]))].join(',')
    let tvl = (Object.values(markets).reduce((acc, market) => toBN(acc).add(toBN(market.tvl)), '0')).toString()
    let total = (Object.values(markets).reduce((acc, market) => toBN(acc).add(toBN(market.total)), '0')).toString()
    let {decimals} = Object.values(markets)[0]
    const decimalName = deciamlNameMap[Math.pow(10, decimals).toString()]
    const totalDebt = Math.abs(parseFloat(fromWei(total, decimalName)))
    tvl = Math.abs(parseFloat(fromWei(tvl, decimalName)))
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

export default new MainStore()
