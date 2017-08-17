const rules = {
  '10:10': (m) => 3000 * 3,
  '10:30': (m) => 8000 * 3,
  'forever': (m) => 24000 + (m - 30) * 1000,
}

module.exports = rules;