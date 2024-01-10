
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