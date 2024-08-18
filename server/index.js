const restify = require('restify');
require('dotenv').config();

// Checks for required environment variables.
[
  'COPILOT_APP_SECRET',
].forEach(name => {
  if (!process.env[name]) {
    throw new Error(`Environment variable ${name} must be set.`);
  }
});


const server = restify.createServer();
const PORT = parseInt(process.env.SERVER_PORT || '4001');

server.use(restify.plugins.queryParser());

// Registering routes.
server.get('/api/directline/token', require('./routes/directLine/token'));

server.listen(PORT, () => {
  console.log(`Rest API server is listening to port ${PORT}`);
});
