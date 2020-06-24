const fs = require('fs'),
      path = require('path'),
      characters = require('../src/data/characters.json')

fs.mkdirSync(path.join(__dirname, '../tmp'), {recursive: true})

const missing = {}

Object.keys(characters).forEach(model => {
  Object.keys(characters[model].variants).forEach(variantId => {
    characters[model].variants[variantId].mods.forEach(({hash}) => {
      if(!fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/static.png')) &&
         fs.existsSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/model.json'))
      ) {
        missing[model] = missing[model] || {}
        missing[model].variants = missing[model].variants || {}
        missing[model].variants[variantId] = missing[model].variants[variantId] || {}
        missing[model].variants[variantId].mods = missing[model].variants[variantId].mods || []
        missing[model].variants[variantId].mods.push(hash)
      }
      else {
        try {
          fs.unlinkSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/preview-cropped.png'))
        } catch(e) {}
        try {
          fs.unlinkSync(path.join(__dirname, '../docs/characters/' + model + '_' + variantId + '/' + hash + '/preview.png'))
        } catch(e) {}
      }
    })
  })
})

fs.writeFileSync(path.join(__dirname, '../tmp/missing-previws.json'), JSON.stringify(missing, null, 2))