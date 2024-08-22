# Description

In this demo, we will show how to customize a microsoft copilot web chat canvas through HTML, CSS & Vanilla Javascript. 

> IMPORTANT: When dealing with personal data, please respect user privacy. Follow platform guidelines and post your privacy statement online.

# How to run locally

This demo integrates direct line to establish connection within Microsoft Copilot's Web Chat component.

1. [Clone the code](#clone-the-code)
1. [Prepare and run the code](#prepare-and-run-the-code)

## Clone the code

To host this demo, you will need to clone the code and run locally.

1. Clone this repository - `git clone https://github.com/salman0719/microsoft-copilot-web-chat.git`
1. Create one empty file for environment variables in the root folder `.env`


## Prepare and run the code

1. Run the following
   1. `npm install`
   1. `npm run dev` (Use Node: version 20.10.0 & NPM: version 10.2.3 if older versions create issues)
1. Browse to http://localhost:4000/ to start the demo
1. Start editing the `/src/main.js` or `/iframe-container/main.js` and see the changes reflected in the browser

## Build

1. `npm run build` 
   1. You will get all the js, css bundled along with the images used.
   2. There will be two `dist` folder, one in the root folder and one in the `iframe-container` folder
   3. The `iframe-container`'s `dist` folder can be integrated into an existing website, use the necessary contents inside it and make sure all the links are pointing to the correct URL
   4. The root folder's `dist` contents should be deployed to a source (necessary adjustments can be made by taking contents partially from the bundled files, but make sure any links are correct) to be solely used as a webchat component. Ensure that the `<iframe />` inside the `iframe-container` build points to this source. 
2. `npm start` or `npm run preview`
   1. See the bundled version in action, browse to http://localhost:5000/

# Overview

This demonstration includes multiple parts:

-  A web page with Web Chat integrated via JavaScript bundle
-  Web Chat canvas customized through the use of CSS and Vanilla JS
- An <iframe /> container to integrate the webchat as an embedded element
-  A Restify web server for distributing tokens
   -  A REST API that generates Direct Line token for new conversations


### Version
- Node: 20.10.0
- NPM: 10.2.3
