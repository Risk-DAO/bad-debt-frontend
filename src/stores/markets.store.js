import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"
import web3Utils from "web3-utils"

const {fromWei} = web3Utils

const deciamlNameMap = Object.assign({}, ...Object.entries(web3Utils.unitMap).map(([a,b]) => ({ [b]: a })))

class MarketsStore {

  tableData = []
  tableRowDetails = null
  loading = true
  isLocalHost = window.location.hostname === 'localhost'
  apiUrl = 'https://api.riskdao.org'

  constructor () {
    makeAutoObservable(this)
    this.fetchData('MIM')
  }

  fetchData = async (platform) => {
    this.loading = true
    const {data: badDebt} = await axios.get(this.apiUrl + `/bad-debt-sub-jobs?platfrom=${platform}`)
    const rows = Object.entries(badDebt[platform]).map(([k, v])=> {
      const [chain, platform, market] = k.split('_')
      const {total, updated, users, decimals, tvl} = v
      const decimalName = deciamlNameMap[Math.pow(10, decimals).toString()]
      const totalDebt = Math.abs(parseFloat(fromWei(total, decimalName)))
      return {
        platform,
        market,
        chain,
        tvl: fromWei(tvl),
        total: totalDebt,
        ratio: (totalDebt/Number(fromWei(tvl))) * 100,
        updated,
        users,
      }
    })

    const results = rows.sort((a, b) => {
      return Number(b.tvl) - Number(a.tvl)
    })

    runInAction(() => {
      this.tableData = results
    })    
    runInAction(() => {
      this.loading = false
    })
  }

  openTableRowDetails = (name)=> {
    if(this.tableRowDetails === name){
      this.tableRowDetails = null
      return
    }
    this.tableRowDetails = name
  }

  sortBy(sortAttribute){
    this.tableData = this.tableData.slice().sort((a, b) => {
      return Number(b[sortAttribute]) - Number(a[sortAttribute])
    })
  }
}

export default new MarketsStore()
