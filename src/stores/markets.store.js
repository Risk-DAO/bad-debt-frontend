import { makeAutoObservable, runInAction, observe } from "mobx";
import mainStore from "./main.store";

const {normalize, capitalizeFirstLetter} = require('../utils.js');

class MarketsStore {

  tableData = {}
  tableRowDetails = null
  loading = true

  constructor () {
    makeAutoObservable(this)
    this.init()
    observe(mainStore, "initializationPromise", change => {
      this.init()
    })
  }

  init = () => {
    this.fetchData()
  }

  
  clearCache = () => {
    this.tableData = {}
  }

  fetchData = async () => {
    this.loading = true
    this.clearCache();
    await mainStore.initializationPromise
    for(let i = 0; i < mainStore.multiResultPlatforms.length; i++) {
      const platform = mainStore.multiResultPlatforms[i];
      this.tableData[platform] = [];
      const badDebt = mainStore.badDebtSubJobsCache[platform] || {}
      const rows = Object.entries(badDebt).map(([k, v])=> {
        const [chain, platform, market] = k.split('_')
        const {total, updated, users, decimals, tvl} = v
        const totalDebt = Math.abs(normalize(total, decimals))
        const normalizedTvl = Math.abs(normalize(tvl, decimals));
        const displayedMarket = market ? market : chain;
        return {
          platform,
          market: capitalizeFirstLetter(displayedMarket),
          chain,
          tvl: normalizedTvl,
          total: totalDebt,
          ratio: (totalDebt/normalizedTvl) * 100,
          updated,
          users,
          sourceFile: v.sourceFile
        }
      })
      const results = rows.sort((a, b) => {
        return Number(b.tvl) - Number(a.tvl)
      })

      runInAction(() => {
        this.tableData[platform] = results
      })  
    } 
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
    const urlParams = new URLSearchParams(window.location.search);
    const platform = urlParams.get('platform')
    console.log('markets for platform:',platform);
    this.tableData[platform] = this.tableData[platform].slice().sort((a, b) => {
      return Number(b[sortAttribute]) - Number(a[sortAttribute])
    })
  }
}

export default new MarketsStore()
