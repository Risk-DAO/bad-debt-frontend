const fs = require('fs/promises')
const toml = require('toml');
const json2toml = require('json2toml');

const init = async () => {
  const data = await fs.readFile("./wrangler-template.toml", 'utf8')
  const name = process.argv[3]
  const parsed = toml.parse(data)
  parsed.name = name
  parsed.account_id = process.env.ACCOUNT_ID || "account_id"
  parsed.zone_id = process.env.ZONE_ID || "zone_id"
  const changed = json2toml(parsed)
  await fs.writeFile("./wrangler.toml", changed)
}

init()