var express = require('express')
var app = express()

app.use(express.static('_site'))
app.use('/public', express.static('public'))

app.listen(4000, () => {
  console.log('NRRD development server running on port 4000')
})
