import clientApplication from "./utils/clientApplication.js";
import configureElements from "./utils/configureElements.js";
import { FULLSCREEN_SEARCH_QUERY_KEY } from "./utils/constants.js";
import { handleCondensation, handleFullscreen, handleModeToggle, handleWindowToggle } from "./utils/helper.js";
import renderWebChat from "./utils/renderWebChat.js";
import { isAuthenticated, isTokenExpired, onSignIn } from "./utils/rootScript.js";
import { getData, setData } from "./utils/store.js";

(function () {
  configureElements()
  handleFullscreen()
  setData('isFullscreen',
    (new URLSearchParams(location.search)).get(FULLSCREEN_SEARCH_QUERY_KEY) === '1')
  !getData('isFullscreen') && handleCondensation()
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
      if (authenticated) {
        onSignIn();
      } else {
        // TODO
        // Use `getElement`
        document.querySelector("#chat-window #login-screen").style.display = "block flex";
      }
    })
  } else {
    renderWebChat()
  }

}());