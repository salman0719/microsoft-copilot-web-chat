# Description

In this demo, we will show how to customize a microsoft copilot web chat canvas through HTML, CSS & Vanilla Javascript. 

> IMPORTANT: When dealing with personal data, please respect user privacy. Follow platform guidelines and post your privacy statement online.

# How to run locally

This demo integrates direct line only.

1. [Clone the code](#clone-the-code)
1. [Prepare and run the code](#prepare-and-run-the-code)

## Clone the code

To host this demo, you will need to clone the code and run locally.

1. Clone this repository
1. Create one empty file for environment variables `.env`


## Configure Direct Line
1. Create Copilot Bot/App through the Microsoft Copilot Studio
2. Enter Settings->Security->Web channel security
3. Collect a secret and enter it in the `.env` file (Don't expose it elsewhere)
      -  `COPILOT_APP_SECRET=<your_copilot_app_secret>`  


## Prepare and run the code

1. Run the following
   1. `npm install`
   1. `npm start` (Use Node: version 20.10.0 & NPM: version 10.2.3 if older versions create issues)
1. Browse to http://localhost:5000/ to start the demo

## Build

1. `npm run build` (Whole process is still in progress)
   - This will bundle and minify css & js files. However, for a production grade bundling, even sophisticated method could be undertaken.

# Code

-  This is the REST API for distributing Direct Line tokens
   -  `GET /api/directline/token` will generate a new Direct Line token for the React app

# Overview

This sample includes multiple parts:

-  A basic web page with Web Chat integrated via JavaScript bundle
-  A Restify web server for distributing tokens
   -  A REST API that generate Direct Line token for new conversations


## Content of the `.env` files

The `.env` file hold the environment variable critical to run the service. These are usually security-sensitive information and must not be committed to version control.

To ease the setup of this sample, here is the template of `.env` files.

### `.env`

```
COPILOT_APP_SECRET=EACsadPXlqrd.5hq2asd4UAiFasdvasqwmXrz4R-fzJdwad0M
```

### Version
- Node: 20.10.0
- NPM: 10.2.3
