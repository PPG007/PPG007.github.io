const fs = require('fs')
const path = require('path')

var Sidebar = {}

function readSubConfig(dirName) {
  if (dirName.startsWith('.')) {
    return
  }
  const files = fs.readdirSync(dirName)
  for (let i = 0; i < files.length; i++) {
    const tempPath = path.join(dirName, files[i])
    if (files[i].startsWith('.')) {
      continue
    }
    if (fs.lstatSync(tempPath).isDirectory()) {
      readSubConfig(tempPath)
    } else if(files[i] == 'index.json') {
      const data = fs.readFileSync(tempPath, 'utf-8')
      side = JSON.parse(data)
      Sidebar = {
        ...Sidebar,
        ...side,
      }
    }
  }
}

readSubConfig('docs')

module.exports.Sidebar = Sidebar
