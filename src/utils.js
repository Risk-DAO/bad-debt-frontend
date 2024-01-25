
import moment from "moment"
import web3Utils from "web3-utils"

const {fromWei, toBN} = web3Utils

export function normalize(amount, decimals) {
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

export function removeSpaces(str) {
  return str.toLowerCase().replace(/\s+/g, '');
}

export const API_URL = 'https://api.dex-history.la-tribu.xyz/api';

export function xAxisTimestampFormatter(date) {
  const formattedDate = moment(date, "DD.MM.YYYY").format('MMM DD');
  return formattedDate;
}

export function timestampFormatter(date) {
  const formattedDate = moment(date, "DD.MM.YYYY").format('l')
  return formattedDate;
}

export function CLFNumberFormatter(number) {
  return number.toFixed(2);
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function roundTo(num, dec = 2) {
  const pow = Math.pow(10, dec);
  return Math.round((num + Number.EPSILON) * pow) / pow;
}

export function largeNumberFormatter(number) {
  if (number >= 1e9) {
      return `${(Number((number / (1e9)).toFixed(2)))}B`;
  }
  if (number >= 1e6) {
      return `${(Number((number / (1e6)).toFixed(2)))}M`
  }
  if (number >= 1e3) {
      return `${(Number((number / (1e3)).toFixed(2)))}K`
  }
  return `${(Number(number).toFixed(2))}`
}

export const storePlatformMapping = {
  morpho:'morpho-blue'
}

export const storeReversePlatformMapping = {
  'morpho-blue':'morpho'
}

export const nameMaps = {
  "rari-capital": "Rari (Tetranode pool)",
  "rikki": "Rikkei Finance",
  "apeswap": "ApeSwap",
  "inverse": "Inverse Finance - frontier (deprecated)",
"morpho-blue": "Morpho Blue Flagship Markets"
}

export const morphoMarketsMap = {
"0xb323495f7e4148be5643a4ea4a8221eef163e4bccfdedc2a6f4696baacbc86cc": {
  loanToken: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  collateralToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  lltv: '86%'
},
"0x3a85e619751152991742810df6ec69ce473daef99e28a64ab2340d7b7ccfee49": {
  loanToken: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  collateralToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  lltv: '86%'
},
"0x7dde86a1e94561d9690ec678db673c1a6396365f7d1d65e129c5fff0990ff758": {
  loanToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  collateralToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  lltv: '86%'
},
"0xf9acc677910cc17f650416a22e2a14d5da7ccb9626db18f1bf94efe64f92b372": {
  loanToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  collateralToken: '0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0',
  lltv: '91.5%'
},

}