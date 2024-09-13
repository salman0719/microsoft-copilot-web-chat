import { exchangeTokenAsync, getClientUsername, getUserId } from './clientApplication';
import { BOT_NAME, BOT_TOKEN_ENDPOINT, WEBCHAT_TOKEN_KEY } from './constants';
import {
  webchatInitialized,
  isFullscreen,
  isCondensed,
  webchatStore,
  sendBoxChatLimitCrossed,
  username,
  directLine,
} from './store';
import {
  fontFamily,
  updateLastMsgTime,
  isTokenExpired,
  fetchJSON,
  isLastMsg,
  getOAuthCardResourceUri,
} from './helper';
import botAvatarImageSrc from '../images/chat-bot-icon.png';

// @ts-expect-error: Comes directly from Microsoft's webchat botframework script
const WebChat = window.WebChat;

async function main() {
  const userId = getUserId();
  const oldToken = localStorage.getItem(WEBCHAT_TOKEN_KEY);
  let currentToken, isNewSession;

  if (oldToken === undefined || oldToken === null || oldToken === 'undefined') {
    const { token } = await fetchJSON(BOT_TOKEN_ENDPOINT);
    isNewSession = true;
    currentToken = token;
    localStorage.setItem(WEBCHAT_TOKEN_KEY, token);
  } else {
    if (isTokenExpired(oldToken)) {
      const { token } = await fetchJSON(BOT_TOKEN_ENDPOINT);
      isNewSession = true;
      currentToken = token;
      localStorage.setItem(WEBCHAT_TOKEN_KEY, token);
    } else {
      currentToken = oldToken;
      isNewSession = false;
    }
  }

  directLine.value = await WebChat.createDirectLine({ token: currentToken });

  if (isNewSession && !isFullscreen.value) {
    isCondensed.value = true;
  }

  // @ts-expect-error: We haven't yet included webchat library's ts version
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

      username.value = action.meta.username || getClientUsername() || '';
    } else if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const activity = action.payload.activity;
      let resourceUri;
      activity.from && activity.type === 'message' && updateLastMsgTime(activity.timestamp);

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
                // @ts-expect-error: We haven't yet included webchat library's ts version
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
                    name: getClientUsername(),
                    role: 'user',
                  },
                })
                .subscribe(
                  (id: string) => {
                    if (id === 'retry') {
                      // Bot was not able to handle the invoke, so display the oauthCard
                      return next(action);
                    }
                    // Else: tokenexchange successful and we do not display the oauthCard
                  },
                  (_error: unknown) => {
                    // An error occurred to display the oauthCard
                    return next(action);
                  }
                );
              return;
            } else {
              return next(action);
            }
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

  WebChat.renderWebChat(
    {
      directLine: directLine.value,
      store,
      styleOptions,
    },
    document.getElementById('webchat')
  );

  webchatStore.value = store;
  webchatInitialized.value = true;
}

export default function renderWebChat() {
  main().catch((err) => console.error('An error occurred: ' + err));
}
