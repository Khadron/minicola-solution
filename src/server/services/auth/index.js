const path = require('path')
const LPC = require('../../lpc')

const getInstance = (function() {
  if (process.env.NODE_ENV === 'local') {
    console.log('*** debug mode ***')
    const handler = require('./tokenHandler')
    return Promise.resolve({
      decode: function(token, callback) {
        return callback(false, handler.decode(token))
      },
      encode: function(content, callback) {
        return callback(false, handler.encode(content))
      }
    })
  } else {
    return LPC(path.join(__dirname, './tokenHandler'))
  }
})()
module.exports = getInstance
