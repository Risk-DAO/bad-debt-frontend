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
  apiUrl = 'https://api.riskdao.org'
  blackMode =  null

  constructor () {
    makeAutoObservable(this)
    this.init()
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

  init = async () => {
    const {data: subJobs} = await axios.get(this.apiUrl + '/bad-debt-sub-jobs')
    const subJobSummeries = Object.entries(subJobs).map(this.summrizeSubJobs)
    const {data: badDebt} = await axios.get(this.apiUrl + '/bad-debt')
    
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
