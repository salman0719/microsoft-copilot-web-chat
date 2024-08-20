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

const clientApplication = new msal.PublicClientApplication(msalConfig);

export default clientApplication