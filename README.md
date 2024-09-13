# Description

In this demo, we will show how to customize a microsoft copilot web chat canvas through HTML, CSS & Vanilla Javascript. We will embed it inside an iframe and use Microsoft Authentication Library to handle authentication prior to chat initiation with the bot.

> IMPORTANT: When dealing with personal data, please respect user privacy. Follow platform guidelines and post your privacy statement online.

# How to run locally

This demo integrates direct line to establish connection within Microsoft Copilot's Web Chat component.

1. [Clone the code](#clone-the-code)
1. [Prepare and run the code](#prepare-and-run-the-code)

## Clone the code

To host this demo, you will need to clone the code and run locally.

1. Clone this repository - `git clone https://github.com/salman0719/microsoft-copilot-web-chat.git`
1. Create one empty file for environment variables in the root folder `.env`

## Configure Bot & App

1. Create Copilot Bot/App through the Microsoft Copilot Studio
2. Enter Channels->Mobile App and collect the token endpoint & populate the following env variable
   - `VITE_BOT_TOKEN_ENDPOINT=<your_bot_token_endpoint>`
3. Enter Azure->App registrations->All applications and then select your newly created app (this is associated with your bot).
4. Enter Quickstart->Single-page application->Javascript and complete configuration
5. Go to Manage->Authentication inside that app if you want to update the redirect URIs. Point it to your port that your localhost is using. (So set `http://localhost:7000)` if that is where your code is developed/previewed.)
6. Go to 'Overview' to collect the client & tenant ID information and update the env variables
   - `VITE_MSAL_CLIENT_ID=<your_app_client_id>`
   - `VITE_MSAL_TENANT_ID=<your_app_tenant_id>`

## Prepare and run the code

1. Run the following
   1. `npm install`
   1. `npm run dev` (Use Node: version 20.10.0 & NPM: version 10.2.3 if older versions create issues)
      1. This will start the webchat inside an embedded iframe. The iframe container's source code is placed in `/iframe-container` folder.
      1. Browse to http://localhost:4000/ to start the demo.
   1. `npm run dev-solo`
      1. Integrates the webchat component inside the current window without any embed.
      1. Browse to http://localhost:3000/ to start the demo
1. Start editing the `/src/main.js` or `/iframe-container/main.js` and see the changes reflected in the browser

## Build

1. `npm run build`
   1. You will get all the js, css bundled along with the images used.
   2. There will be two `dist` folder, one in the root folder and one in the `iframe-container` folder
   3. The `iframe-container`'s `dist` folder can be integrated into an existing website, use the necessary contents inside it and make sure all the links are pointing to the correct URL
   4. The root folder's `dist` contents should be deployed to a source (necessary adjustments can be made by taking contents partially from the bundled files, but make sure any links are correct) to be solely used as a webchat component. Ensure that the `<iframe />` inside the `iframe-container` build points to this source.
2. `npm run preview`
   1. See the bundled version in action, browse to http://localhost:5000/

## Overview

This demonstration includes multiple parts:

- A microsoft authentication system (using `msal`)
- Microsoft Copilot's Web Chat integrated via Preact
- Web Chat canvas customization through the use of CSS and Preact
- An `<iframe />` container to integrate the webchat as an embedded element

## Content of the .env files

The .env file hold the environment variable critical to run the service. These are usually security-sensitive information and must not be committed to version control.

To ease the setup of this sample, here is the template of .env files.

### .env

Some of the environment variables are followed by helpful instructions, go through it for better understanding.

```
PORT=3000
PREVIEW_PORT=3100
VITE_EMBED_PARENT_PORT=4000
VITE_EMBED_PARENT_PREVIEW_PORT=5000
VITE_EMBED_CHILD_PORT=7000
VITE_IGNORE_AUTH=0 # Setting `1` disables the authentication flow
VITE_MSAL_CLIENT_ID=
VITE_MSAL_TENANT_ID=
VITE_BOT_TOKEN_ENDPOINT=
VITE_EMBED_PARENT_ORIGIN=https://localhost:4000 # Should include the origin of the primary parent host, applicable in production mode
VITE_ENABLE_FULLSCREEN=0 # Setting `1` allows to enable fullscreen, applicable in `npm run dev-solo` and relevant modes
VITE_EMBED_CHILD_URL=http://localhost:7000 # Should include the URL where the msal auth & webchat component get deployed, applicable in production mode
```

### Version

- Node: 20.10.0
- NPM: 10.2.3
