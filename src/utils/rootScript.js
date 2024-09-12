import clientApplication from './clientApplication.js';
import { WEBCHAT_LAST_MSG_TIME_KEY } from './constants.tsx';
import renderWebChat from './renderWebChat.js';
import { authenticated } from './store.ts';

export function onSignIn() {
  authenticated.value = true;
  renderWebChat();
}

export function onSignInClick() {
  let requestObj = {
    scopes: ['user.read', 'openid', 'profile'],
  };

  clientApplication
    .loginPopup(requestObj)
    .then(function (response) {
      clientApplication.setActiveAccount(response.account);
      onSignIn();
    })
    .catch(function (error) {
      console.log(error);
    });
}

export async function isAuthenticated() {
  const returnValue = (value) => {
    value = !!value;
    authenticated.value = value;
    return value;
  };

  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_IGNORE_AUTH === '1') {
    return returnValue(true);
  }

  let currentAccounts = clientApplication.getAllAccounts();
  if (currentAccounts.length > 0) {
    let requestObj = {
      scopes: ['user.read', 'openid', 'profile'],
      redirectUri: 'https://unswauepstaetsbot.blob.core.windows.net/custom-canvas/RedirectUri.html',
    };
    return clientApplication
      .acquireTokenSilent(requestObj)
      .then(function () {
        return returnValue(true);
      })
      .catch(function (error) {
        console.log(error);
        return returnValue(false);
      });
  } else {
    return returnValue(false);
  }
}

export function getOAuthCardResourceUri(activity) {
  if (
    activity &&
    activity.attachments &&
    activity.attachments[0] &&
    activity.attachments[0].contentType === 'application/vnd.microsoft.card.oauth' &&
    activity.attachments[0].content.tokenExchangeResource
  ) {
    // asking for token exchange with AAD
    return activity.attachments[0].content.tokenExchangeResource.uri;
  }
}

export function exchangeTokenAsync(resourceUri) {
  let currentAccounts = clientApplication.getAllAccounts();
  if (currentAccounts.length > 0) {
    let requestObj = {
      scopes: [resourceUri],
      redirectUri: 'https://unswauepstaetsbot.blob.core.windows.net/custom-canvas/RedirectUri.html',
    };
    return clientApplication
      .acquireTokenSilent(requestObj)
      .then(function (tokenResponse) {
        return tokenResponse.accessToken;
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    return Promise.resolve(null);
  }
}

export async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      accept: 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch JSON due to ${res.status}`);
  }

  return await res.json();
}

export function isTokenExpired(token) {
  if (!token) {
    // Token is considered expired if not available
    return true;
  }
  const tokenData = parseJwt(token);
  // Check if the token has an 'exp' claim
  if (tokenData && tokenData.exp) {
    const expirationTime = tokenData.exp * 1000; // Convert to milliseconds
    const currentTime = new Date().getTime();
    // Check if the token has expired
    return currentTime > expirationTime;
  }
  // Token is considered expired if 'exp' claim is missing
  return true;
}

export function parseJwt(token) {
  try {
    // Parse the JWT token
    return JSON.parse(atob(token.split('.')[1]));
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
}

export function isLastMsg(timestamp) {
  var oldTimestamp = localStorage.getItem(WEBCHAT_LAST_MSG_TIME_KEY);
  if (oldTimestamp !== null && new Date(timestamp) < new Date(oldTimestamp)) {
    return false;
  } else return true;
}

export function updateLastMsgTime(timestamp) {
  if (isLastMsg(timestamp)) localStorage.setItem(WEBCHAT_LAST_MSG_TIME_KEY, timestamp);
}

export function fontFamily(fonts) {
  return fonts.map((font) => `'${font}'`).join(', ');
}
