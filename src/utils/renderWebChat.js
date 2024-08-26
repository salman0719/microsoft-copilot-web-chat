import clientApplication from "./clientApplication.js";
import {
  BOT_NAME,
  BOT_TOKEN_ENDPOINT,
  INPUT_CHAR_LIMIT,
} from "./constants.ts";
import { getData, setData } from "./store.ts";
import {
  handleCondensation,
  handleConversationResize,
  handleInput,
  handleUsername,
  handleWebchatInitialization,
  insertDisclosureText,
  insertInputCounter,
  updateInputPlaceholder,
} from "./helper.js";
import botAvatarImageSrc from "../images/chat-bot-icon.png";
import { exchangeTokenAsync, fetchJSON, fontFamily, getOAuthCardResourceUri, isLastMsg, isTokenExpired, updateLastMsgTime } from "./rootScript.js";

async function main() {
  handleWebchatInitialization()

  // Add your BOT ID below 
  var theURL = BOT_TOKEN_ENDPOINT

  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_DUMMY_MODE === '1') {
    theURL = "https://2d1f588f9702ed519606739c183a1d.c9.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr967_tempTestForCanvasDevelopment/directline/token?api-version=2022-03-01-preview"
  }

  var userId = clientApplication.account?.accountIdentifier != null ?
    ("AIDE" + clientApplication.account.accountIdentifier).substring(0, 64)
    : (Math.random().toString() + Date.now().toString()).substring(0, 64);
  let currentToken;
  let oldToken = sessionStorage.getItem('oldToken') != undefined && sessionStorage.getItem('oldToken') != "undefined" ? sessionStorage.getItem('oldToken') : null;
  var isNewSession;
  if (getData('isFullscreen') || oldToken === undefined || oldToken === null) {
    const { token } = await fetchJSON(theURL);
    isNewSession = true;
    currentToken = token;
    sessionStorage.setItem("oldToken", token);
  } else {
    if (isTokenExpired(oldToken)) {
      const { token } = await fetchJSON(theURL);
      isNewSession = true;
      currentToken = token;
      sessionStorage.setItem("oldToken", token);
    } else {
      currentToken = oldToken;
      isNewSession = false;
    }
  }
  let latestToken = { "token": currentToken };
  let directLine;
  if (latestToken !== undefined && latestToken !== null) {
    directLine = await window.WebChat.createDirectLine(latestToken);
  } else {
    return;
  }

  handleCondensation(isNewSession)

  const store = WebChat.createStore({}, ({ dispatch }) => next => action => {
    const { type } = action

    if (type === 'DIRECT_LINE/CONNECT_FULFILLED') {
      if (isNewSession) {
        dispatch({
          type: 'WEB_CHAT/SEND_EVENT',
          payload: {
            name: 'startConversation',
            type: 'event',
            value: { text: "hello" }
          }
        });
      }
      setData('username', action.meta.username || clientApplication?.getActiveAccount()?.name || '')
    } else if (type === 'DIRECT_LINE/INCOMING_ACTIVITY') {
      const activity = action.payload.activity;
      let resourceUri;
      if (activity.from && activity.type === 'message')
        updateLastMsgTime(activity.timestamp);
      // Intercept OAuth card to get access token via SSO
      if (activity.from && activity.from.role === 'bot' &&
        (resourceUri = getOAuthCardResourceUri(activity))) {
        if (isLastMsg(activity.timestamp)) {
          exchangeTokenAsync(resourceUri).then(function (token) {
            if (token) {
              directLine.postActivity({
                type: 'invoke',
                name: 'signin/tokenExchange',
                value: {
                  id: activity.attachments[0].content.tokenExchangeResource.id,
                  connectionName: activity.attachments[0].content.connectionName,
                  token
                },
                "from": {
                  id: userId,
                  name: clientApplication.getActiveAccount().name,
                  role: "user"
                }
              }).subscribe(
                id => {
                  if (id === 'retry') {
                    // Bot was not able to handle the invoke, so display the oauthCard
                    return next(action);
                  }
                  // Else: tokenexchange successful and we do not display the oauthCard
                },
                error => {
                  // An error occurred to display the oauthCard
                  return next(action);
                }
              );
              return;
            }
            else
              return next(action);
          });
        }

        return
      }
    } else if (type === 'WEB_CHAT/SUBMIT_SEND_BOX') {
      if (getData('sendBoxValue').length > INPUT_CHAR_LIMIT) {
        return
      }
    }

    return next(action);
  });

  const styleOptions = {
    // Add styleOptions to customize Web Chat canvas
    hideUploadButton: true,
    primaryFont: fontFamily(['Roboto', 'Helvetica Neue', 'Arial', 'sans-serif']),
    // bubbleBackground: '#f2f2f7',
    // bubbleTextColor: '#1c1c1e',
    // botAvatarBackgroundColor: 'rgba(255, 255, 255, 1)',
    botAvatarImage: botAvatarImageSrc,
    botAvatarInitials: BOT_NAME[0].toUpperCase(),
  };

  window.WebChat.renderWebChat(
    {
      directLine,
      store,
      // userID: userId,
      styleOptions
    },
    document.getElementById('webchat')
  );

  setData('webChatStore', store)
  handleUsername()
  handleInput()
  insertDisclosureText()
  updateInputPlaceholder()
  insertInputCounter()
  __IS_EMBED_CHILD__ && handleConversationResize()

  setData('webchatInitialized', true)
};

export default function renderWebChat() {
  main().catch(err => console.error("An error occurred: " + err));
}