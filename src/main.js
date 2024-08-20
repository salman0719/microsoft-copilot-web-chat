import {
  BOT_NAME,
  FULLSCREEN_SEARCH_QUERY_KEY,
  INPUT_CHAR_LIMIT,
} from "./utils/constants.js";
import { getData, setData } from "./utils/store.js";
import configureElements from "./utils/configureElements.js";
import {
  handleCondensation,
  handleInput,
  handleModeToggle,
  handleUsername,
  handleWindowToggle,
  insertDisclosureText,
  insertInputCounter,
  handleFullscreen,
  updateInputPlaceholder,
} from "./utils/helper.js";
import botAvatarImageSrc from "./images/chatboticon.png";
import { processStatusUpdate } from "./utils/actions.js";

window.IntegrateBot = async function () {
  // Add your BOT ID below 
  var theURL = "https://829ad9b9104ce6878ce96c9c25af46.ca.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr967_studentBotDev/directline/token?api-version=2022-03-01-preview"; // You can find the token URL via the mobile app channel configuration

  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_DUMMY_MODE === '1') {
    theURL = "https://2d1f588f9702ed519606739c183a1d.c9.environment.api.powerplatform.com/powervirtualagents/botsbyschema/cr967_tempTestForCanvasDevelopment/directline/token?api-version=2022-03-01-preview" // You can find the token URL via the mobile app channel configuration
  }

  var userId = clientApplication.account?.accountIdentifier != null ?
    ("AIDE" + clientApplication.account.accountIdentifier).substring(0, 64)
    : (Math.random().toString() + Date.now().toString()).substring(0, 64);
  let currentToken;
  let oldToken = sessionStorage.getItem('oldToken') != undefined && sessionStorage.getItem('oldToken') != "undefined" ? sessionStorage.getItem('oldToken') : null;
  var isNewSession;
  if (oldToken == undefined && oldToken == null) {
    const { token } = await fetchJSON(theURL);
    isNewSession = true;
    currentToken = token;
    sessionStorage.setItem("oldToken", token);
  }
  else {
    if (isTokenExpired(oldToken)) {
      const { token } = await fetchJSON(theURL);
      isNewSession = true;
      currentToken = token;
      sessionStorage.setItem("oldToken", token);
    }
    else {
      currentToken = oldToken;
      isNewSession = false;
    }
  }
  let latestToken = { "token": currentToken };
  let directLine;
  if (latestToken !== undefined && latestToken !== null) {
    directLine = await window.WebChat.createDirectLine(latestToken);
  }
  else
    return;

  const store = WebChat.createStore({}, ({ dispatch }) => next => action => {
    const { type, payload } = action

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
    } else if (type === 'DIRECT_LINE/CONNECTION_STATUS_UPDATE') {
      processStatusUpdate(payload, isNewSession)
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

  configureElements()
  handleFullscreen()
  setData('isFullscreen',
    (new URLSearchParams(location.search)).get(FULLSCREEN_SEARCH_QUERY_KEY) === '1')

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
  handleWindowToggle()
  !getData('isFullscreen') && handleCondensation()
  insertInputCounter()
  handleModeToggle()
};

(function () {
  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_DUMMY_MODE === '1') {
    clientApplication = {
      getActiveAccount: () => {
        return {
          name: 'Jenny Smith'
        }
      },
      account: {
        accountIdentifier: 'asdhkj-213bnjasd-123hb'
      }
    }

    window.isAuthenticated = () => {
      return true
    }

    window.IntegrateBot()

    return
  }


  var msalConfig = {
    auth: {
      clientId: 'bf3b31f3-7df6-45d6-8f66-70a15dbeec76',
      authority: 'https://login.microsoftonline.com/3ff6cfa4-e715-48db-b8e1-0867b9f9fba3'
    },
    cache: {
      cacheLocation: 'localStorage',
      storeAuthStateInCookie: true
    }
  };
  if (!clientApplication) {
    clientApplication = new msal.PublicClientApplication(msalConfig);
    let oldToken = sessionStorage.getItem('oldToken') != undefined && sessionStorage.getItem('oldToken') != "undefined" ? sessionStorage.getItem('oldToken') : null;
    if (oldToken == null || isTokenExpired(oldToken)) {
      isAuthenticated().then(function (authenticated) {
        if (authenticated) {
          onSignin();
        } else {
          document.getElementById("loginscreen").style.display = "block flex";
        }
      })
    } else
      window.IntegrateBot().catch(err => console.error("An error occurred: " + err));
  }
}());