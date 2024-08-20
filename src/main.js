import clientApplication from "./utils/clientApplication.js";
import configureElements from "./utils/configureElements.js";
import { handleAuthentication, handleFullscreen, handleModeToggle, handleWindowToggle, setupLoginButton } from "./utils/helper.js";
import renderWebChat from "./utils/renderWebChat.js";
import { isAuthenticated, isTokenExpired, onSignIn } from "./utils/rootScript.js";

(function () {
  configureElements()
  setupLoginButton()
  handleAuthentication()
  handleFullscreen()
  handleWindowToggle()
  handleModeToggle()

  if (import.meta.env.MODE === 'development' && import.meta.env.VITE_USE_DUMMY_MODE === '1') {
    clientApplication.getActiveAccount = () => ({
      name: 'Jenny Smith'
    })

    renderWebChat()
    return
  }

  let oldToken = sessionStorage.getItem('oldToken')
  if (oldToken == undefined || oldToken == 'undefined') {
    oldToken = null
  }

  if (oldToken == null || isTokenExpired(oldToken)) {
    isAuthenticated().then(function (authenticated) {
      authenticated && onSignIn()
    })
  } else {
    renderWebChat()
  }

}());