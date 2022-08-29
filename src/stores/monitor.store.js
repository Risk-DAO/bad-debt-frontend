import { makeAutoObservable, runInAction } from "mobx"
import axios from "axios"

import Web3 from 'web3'
const { toBN, toWei, fromWei } = Web3.utils

const chains = {
  "ethereum": {
    "id": "1",
    "ETH": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "USD": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", "decimals": "6"
  },
  "avalanche": {
    "id": "43114", "ETH": "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    "USD": "0xA7D7079b0FEaD91F3e65f86E8915Cb59c1a4C664", "decimals": "6"
  },
  "polygon": {
    "id": "137", "ETH": "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    "USD": "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", "decimals": "6"
  },
  "bsc": {
    "id": "56", "ETH": "0x2170Ed0880ac9A755fd29B2688956BD959F933F8",
    "USD": "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", "decimals": "18"
  },
  "fantom": {
    "id": "250", "ETH": "0x74b23882a30290451A17c44f4F05243b6b58C76d",
    "USD": "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", "decimals": "6"
  },
  "cronos": {
    "id": "25", "ETH": "0xe44Fd7fCb2b1581822D0c862B68222998a0c299a",
    "USD": "0xc21223249CA28397B4B6541dfFaEcC539BfF0c59", "decimals": "6"
  },
  "arbitrum": {
    "id": "42161", "ETH": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "USD": "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8", "decimals": "6"
  },
  "aurora": {
    "id": "1313161554", "ETH": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "USD": "0xB12BFcA5A55806AaF64E99521918A4bf0fC40802", "decimals": "6"
  },
  "optimism": {
    "id": "10", "ETH": "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    "USD": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607", "decimals": "6"
  }
}


function getKyberUrl(chain, tokenIn, tokenOut, amountIn, deadline) {
    return  "https://aggregator-api.kyberswap.com/" + chain +"/route/encode?" +
    "tokenIn=" + tokenIn + "&" +
    "tokenOut=" + tokenOut + "&" +
    "amountIn=" + amountIn + "&" +
    "saveGas=0&" +
    "gasInclude=0&" +
    "gasPrice=70000000&" +
    "slippageTolerance=50&" +
    "deadline=" + deadline + "&" +
    "to=0x0000000000000000000000000000000000000000&" +
    "chargeFeeBy=&" +
    "feeReceiver=&" +
    "isInBps=&feeAmount=&" +
    "clientData={'source':'kyberswap'}"    
}


async function getSellPrice(chain, mainnetMidPrice) {
    const deadline = (Math.floor(Date.now() / 1000) + 1000).toString()
    const urlSell = getKyberUrl(chain, chains[chain].ETH, chains[chain].USD, toWei("1"), deadline)
    const sellResult = await axios.get(urlSell, "", {headers: {"Accept-Version":"Latest"}})
    const returnUSDAmount = sellResult.data.outputAmount.toString()
    const decimalFactor = toBN("10").pow(toBN((18 - Number(chains[chain].decimals)).toString()))
    const ethSellPrice = Number(fromWei(toBN(returnUSDAmount).mul(decimalFactor)))
    const buyUrl = getKyberUrl(chain, chains[chain].USD, chains[chain].ETH, returnUSDAmount, deadline)
    const buyResult = await axios.get(buyUrl, "", {"Accept-Version":"Latest"})
    const returnETHAmount = buyResult.data.outputAmount.toString()
    const ethBuyPrice = Number(fromWei(toBN(returnUSDAmount).mul(decimalFactor))) / Number(fromWei(returnETHAmount))


    const midPrice = (ethSellPrice + ethBuyPrice) / 2

    const buyDeviation = 100 * (mainnetMidPrice / ethBuyPrice - 1)
    const sellDeviation = 100 * (mainnetMidPrice / ethSellPrice - 1)
    const midDeviation = 100 * (mainnetMidPrice / midPrice - 1)

    console.log(chain, ethBuyPrice, "(" + buyDeviation + ")", ethSellPrice, "(" + sellDeviation + ")",
                midPrice, "(" + midDeviation + ")")

  return { 
    chain,
    "buy": ethBuyPrice, 
    "sell": ethSellPrice, 
    "mid": midPrice, 
    buyDeviation, 
    sellDeviation, 
    midDeviation 
  }
}

async function test() {
    const base = await getSellPrice("ethereum", 0)
    const ethereumMid = base.mid
    for(const network of Object.keys(chains)) {
        const res = await getSellPrice(network, ethereumMid)
    }
}
test()

class MonitorStore {
  
  prices = []
  loading = true
  constructor (){
    makeAutoObservable(this)
    this.init()
  }

  init = async () => {
    debugger
    const base = await getSellPrice("ethereum", 0)
    const ethereumMid = base.mid
    const promises = []
    for(const network of Object.keys(chains)) {
      promises.push(getSellPrice(network, ethereumMid))
    }
    const results = await Promise.all(promises)
    runInAction(() => {
      this.prices = results
      this.loading = false
    })
  }
}

export default new MonitorStore()