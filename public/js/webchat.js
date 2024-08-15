// This is a helper function for fetching JSON resources.
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      accept: 'application/json'
    }
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch JSON due to ${res.status}`);
  }

  return await res.json();
}

(async function main() {
  // This is for obtaining Direct Line token from the bot.
  const { token } = await fetchJSON('/api/directline/token');

  // Triggers bot with initial message, in order to have greeting message render on load.
  const store = WebChat.createStore({}, ({ dispatch }) => next => action => {
    const { type } = action;

    if (type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      const text = 'I need help with submitting my assessment.'

      dispatch({
        type: 'WEB_CHAT/SET_SUGGESTED_ACTIONS',
        payload: {
          suggestedActions: [
            {
              type: 'messageBack',
              title: 'Need help with submitting your assessment?',
              displayText: text,
              text,
              value: text
            },
          ]
        }
      });
    }
    return next(action);
  });

  WebChat.renderWebChat(
    {
      directLine: WebChat.createDirectLine({ token }),
      store,
      styleOptions: {
        backgroundColor: 'rgba(255, 255, 255, .8)',
      },
    },
    document.getElementById('webchat')
  );
})().catch(err => console.error(err));