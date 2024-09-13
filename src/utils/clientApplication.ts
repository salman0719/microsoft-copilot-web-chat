import { MSAL_CLIENT_ID, MSAL_REDIRECT_URI, MSAL_SCOPES, MSAL_TENANT_ID } from './constants';
import { authenticated } from './store';

// @ts-expect-error: Comes directly from msal script
const msal = window.msal;

var msalConfig = {
  auth: {
    clientId: MSAL_CLIENT_ID,
    authority: 'https://login.microsoftonline.com/' + MSAL_TENANT_ID,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true,
  },
};

const clientApplication = new msal.PublicClientApplication(msalConfig);

export const getUserId = (): string =>
  clientApplication.account?.accountIdentifier != null
    ? ('AIDE' + clientApplication.account.accountIdentifier).substring(0, 64)
    : (Math.random().toString() + Date.now().toString()).substring(0, 64);

export const getClientUsername = (): string | null =>
  clientApplication?.getActiveAccount()?.name || null;

export async function isAuthenticated(): Promise<boolean> {
  const returnValue = (value: boolean): boolean => (authenticated.value = value);

  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_IGNORE_AUTH === '1') {
    return returnValue(true);
  }

  const currentAccounts = clientApplication.getAllAccounts();
  if (currentAccounts.length > 0) {
    const requestObj = {
      scopes: MSAL_SCOPES,
      redirectUri: MSAL_REDIRECT_URI,
    };
    return clientApplication
      .acquireTokenSilent(requestObj)
      .then(function () {
        return returnValue(true);
      })
      .catch(function (error: unknown) {
        console.log(error);
        return returnValue(false);
      });
  } else {
    return returnValue(false);
  }
}

export async function exchangeTokenAsync(resourceUri: string | undefined): Promise<string | null> {
  let currentAccounts = clientApplication.getAllAccounts();
  if (currentAccounts.length > 0) {
    let requestObj = {
      scopes: [resourceUri],
      redirectUri: MSAL_REDIRECT_URI,
    };
    return clientApplication
      .acquireTokenSilent(requestObj)
      .then(function (tokenResponse: Record<string, unknown>) {
        return tokenResponse.accessToken as string;
      })
      .catch(function (error: unknown) {
        console.log(error);
      });
  } else {
    return Promise.resolve(null);
  }
}

if (import.meta.env.MODE === 'development' && import.meta.env.VITE_IGNORE_AUTH === '1') {
  clientApplication.getActiveAccount = () => ({
    name: 'Jenny Smith',
  });
}

export default clientApplication;
