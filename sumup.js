const fs = require('fs-extra');

const lateData = fs.readJsonSync('./lateData.json');

const fineData = {}

lateData.data.forEach(({ person, fine }) => {
  console.log(person, fine);
  if (!fineData[person]) fineData[person] = 0;
  fineData[person] += fine;
}) 

console.log(fineData)