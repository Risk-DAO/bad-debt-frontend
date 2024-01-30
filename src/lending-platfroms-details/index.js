import IronBank from './IronBank'
import Inverse from './Inverse'
import Mai from './Mai'
import MIM from './MIM'

/**
 * use kabab-case to register your platform component
 * components should be a simple function rendering simple HTML
 */
const register = {
  "iron-bank": IronBank,
  "inverse": Inverse,
  "MAI": Mai,
  "MIM": MIM
}

export default register