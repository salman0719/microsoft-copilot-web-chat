const fetch = require("node-fetch");

const { COPILOT_APP_SECRET } = process.env;

// Generates a new Direct Line token given the secret.
module.exports = async function generateDirectLineToken() {
  // TEMP
  // return {
  //   "conversationId": "KH0oIJZrESa21YnTMuPJyQ-au",
  //   "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImZqSG90RHFBNkI5TmJMYTNHYktpa1pHRUZvUSIsIng1dCI6ImZqSG90RHFBNkI5TmJMYTNHYktpa1pHRUZvUSIsInR5cCI6IkpXVCJ9.eyJib3QiOiIxYzRkMTNiNy1hNmJmLWIyMzMtODIzZC05ZjBiMGQyZDkwN2IiLCJzaXRlIjoiRUZRLVBYbHFyQUkiLCJjb252IjoiS0gwb0lKWnJFU2EyMVluVE11UEp5US1hdSIsIm5iZiI6MTcyMzcwNDY5NCwiZXhwIjoxNzIzNzA4Mjk0LCJpc3MiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8iLCJhdWQiOiJodHRwczovL2RpcmVjdGxpbmUuYm90ZnJhbWV3b3JrLmNvbS8ifQ.T-lrizRSLIXT2w9bbNcjSZJrRNxb1_3TlIwBCGwWAFWrjt-Lpl7Uxf6BQGiYe6oYfKbiBNQmSOxcRu9GX4fWOA9YUZ08ELgIUzYWZDFxG-aueSj4izHc0yRxIl0XZ7EtUxa2tHrh5Ic84Y9kZMK6THKdVA2gHO3wuyHyDoRMAj0r4HdqYWSalXLRB5W_dl9qQNbUNsLBgLHsvT_2yQf5djcBRRK32krqy01KJWDtjqJ-v57FIp6UNFhx2lG71LPU_bIbI9gNJaqniT4UAYolFT6SjdmNhTtsU7WRCfY26jQlDUdPRtF8x_TseXQ4Aq3W9T3yRum50YJBth-5F8utZw",
  //   "expires_in": 3600
  // }

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
