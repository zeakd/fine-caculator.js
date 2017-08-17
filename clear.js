const fs = require('fs-extra')

fs.writeJsonSync('./lateData.json', { data: []}, {spaces: 2})