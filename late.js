const fs = require('fs-extra');
const rawRules = require('./rules');


const stdin = process.openStdin();
const lateData = fs.readJsonSync('./lateData.json');

const defaultTimeStr = '10:00';
const defaultTime = parseTime(defaultTimeStr);
const defaultMin = defaultTime.hour * 60 + defaultTime.min;

console.log('welcome to Fine Calculator');

function parseTime (str) {
  const hourMin = str.split(':'); 
  if (hourMin.length !== 2) {
    throw new Error('Should input time format as HH:MM');
  }

  const hourStr = hourMin[0];
  const minStr = hourMin[1];
  
  if (!/[0-9]/.test(hourStr) || !/[0-9]/.test(minStr)) {
    throw new Error('hour and min should be a number');
  }

  const hour = parseInt(hourStr);
  const min = parseInt(minStr); 

  return {
    hour,
    min,
  }
}

function parseInput (str) {
  const args = str.split(' ');
  if (args.length < 2) {
    throw new Error('Need more arguments');
  }
  
  const time = parseTime(args[1])
  time.hour;
  time.min;

  return {
    person: args[0],
    timeStr: args[1],
    time,
  }
}

function applyRules(time) {
  const lateMin = time.hour * 60 + time.min;
  let targetRule;

  Object.keys(rules).forEach(ruleMinStr => {
    if (ruleMinStr === 'forever') return;
    
    const ruleMin = parseInt(ruleMinStr);
    if (ruleMin > lateMin && (ruleMin < targetRule || !targetRule)) targetRule = ruleMin;
  })
  if (!targetRule) targetRule = 'forever';

  return rules[targetRule](lateMin - defaultMin);
}

let rules = {}
  
Object.keys(rawRules).forEach((timeStr, index) => {
  if (timeStr === 'forever') {
    rules.forever = rawRules.forever;
    return;
  }
  const time = parseTime(timeStr);
  const min = time.hour * 60 + time.min;
  
  rules[min] = rawRules[timeStr];
})

stdin.addListener('data', dataBuffer => {
  let lateInfo;
  try {
    lateInfo = parseInput(dataBuffer.toString())
  } catch (e) {
    console.log('Wrong Input: ', e.message);
    return;
  }

  console.log('fine info', lateInfo)
  const fine = applyRules(lateInfo.time);
  console.log('Fine: ', fine);
  lateInfo.fine = fine;
  writeLateInfo(lateInfo);
})

function writeLateInfo(lateInfo) {
  lateData.data.push(lateInfo)
  fs.writeJsonSync('./lateData.json', lateData, { spaces: 2 });
}