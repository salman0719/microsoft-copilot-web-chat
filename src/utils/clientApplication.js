import { MSAL_CLIENT_ID, MSAL_TENANT_ID } from './constants';

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

if (import.meta.env.MODE === 'development' && import.meta.env.VITE_IGNORE_AUTH === '1') {
  clientApplication.getActiveAccount = () => ({
    name: 'Jenny Smith',
  });
}

export default clientApplication;
