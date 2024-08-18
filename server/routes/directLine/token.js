const generateDirectLineToken = require('../../generateDirectLineToken');

// This module exports token value to /api/directline/token and can be accessed with GET
// Generates a new Direct Line token
module.exports = async (_, res) => {
  res.cache('public', { maxAge: 3000 })
  res.json(await generateDirectLineToken());
};
