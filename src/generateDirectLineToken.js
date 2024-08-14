const fetch = require("node-fetch");

const { COPILOT_APP_SECRET } = process.env;

// Generates a new Direct Line token given the secret.
module.exports = async function generateDirectLineToken() {
  const response = await fetch('https://directline.botframework.com/v3/directline/tokens/generate', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${COPILOT_APP_SECRET}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to generate token: ${response.statusText}`);
  }

  return await response.json();
};
