import clientApplication from './clientApplication.js';
import { BOT_NAME, BOT_TOKEN_ENDPOINT, WEBCHAT_TOKEN_KEY } from './constants.tsx';
import {
  webchatInitialized,
  isFullscreen,
  isCondensed,
  webchatStore,
  sendBoxChatLimitCrossed,
  username,
  directLine,
} from './store.ts';
import { observeConversationResize, updateInputPlaceholder } from './helper.ts';
import botAvatarImageSrc from '../images/chat-bot-icon.png';
import {
  exchangeTokenAsync,
  fetchJSON,
  fontFamily,
  getOAuthCardResourceUri,
  isLastMsg,
  isTokenExpired,
  updateLastMsgTime,
} from './rootScript.js';

async function main() {
  // Add your BOT ID below
  var theURL = BOT_TOKEN_ENDPOINT;

  var userId =
    clientApplication.account?.accountIdentifier != null
      ? ('AIDE' + clientApplication.acscount.accountIdentifier).substring(0, 64)
      : (Math.random().toString() + Date.now().toString()).substring(0, 64);
  let currentToken;
  const oldToken = localStorage.getItem(WEBCHAT_TOKEN_KEY);
  var isNewSession;

  if ([undefined, null, 'undefined'].includes(oldToken)) {
    const { token } = await fetchJSON(theURL);
    isNewSession = true;
    currentToken = token;
    localStorage.setItem(WEBCHAT_TOKEN_KEY, token);
  } else {
    if (isTokenExpired(oldToken)) {
      const { token } = await fetchJSON(theURL);
      isNewSession = true;
      currentToken = token;
      localStorage.setItem(WEBCHAT_TOKEN_KEY, token);
    } else {
      currentToken = oldToken;
      isNewSession = false;
    }
  }

  directLine.value = await window.WebChat.createDirectLine({ token: currentToken });

  if (isNewSession && !isFullscreen.value) {
    isCondensed.value = true;
  }

  const store = WebChat.createStore({}, ({ dispatch }) => (next) => (action) => {
    const { type } = action;

    if (type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      if (isNewSession) {
        dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: 'startConversation',
            type: 'event',
            value: { text: 'hello' },
          },
        });
      }

      username.value = action.meta.username || clientApplication?.getActiveAccount()?.name || '';
    } else if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const activity = action.payload.activity;
      let resourceUri;
      if (activity.from && activity.type === 'message') updateLastMsgTime(activity.timestamp);
      // Intercept OAuth card to get access token via SSO
      if (
        activity.from &&
        activity.from.role === 'bot' &&
        (resourceUri = getOAuthCardResourceUri(activity))
      ) {
        if (isLastMsg(activity.timestamp)) {
          exchangeTokenAsync(resourceUri).then(function (token) {
            if (token) {
              directLine
                .postActivity({
                  type: 'invoke',
                  name: 'signin/tokenExchange',
                  value: {
                    id: activity.attachments[0].content.tokenExchangeResource.id,
                    connectionName: activity.attachments[0].content.connectionName,
                    token,
                  },
                  from: {
                    id: userId,
                    name: clientApplication.getActiveAccount().name,
                    role: 'user',
                  },
                })
                .subscribe(
                  (id) => {
                    if (id === 'retry') {
                      // Bot was not able to handle the invoke, so display the oauthCard
                      return next(action);
                    }
                    // Else: tokenexchange successful and we do not display the oauthCard
                  },
                  (error) => {
                    // An error occurred to display the oauthCard
                    return next(action);
                  }
                );
              return;
            } else return next(action);
          });
        }

        return;
      }
    } else if (type === 'WEB_CHAT/SUBMIT_SEND_BOX') {
      if (sendBoxChatLimitCrossed.value) {
        return;
      }
    }

    return next(action);
  });

  const styleOptions = {
    hideUploadButton: true,
    primaryFont: fontFamily(['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']),
    botAvatarImage: botAvatarImageSrc,
    botAvatarInitials: BOT_NAME[0].toUpperCase(),
  };

  window.WebChat.renderWebChat(
    {
      directLine: directLine.value,
      store,
      styleOptions,
    },
    document.getElementById('webchat')
  );

  webchatStore.value = store;

  updateInputPlaceholder();
  __IS_EMBED_CHILD__ && observeConversationResize();

  webchatInitialized.value = true;

  // TODO
  // Need to ponder probable unmounting scenario
  // In that case, we will need to clean up a lot of the states
  // along with observer(s)
}

export default function renderWebChat() {
  main().catch((err) => console.error('An error occurred: ' + err));
}
