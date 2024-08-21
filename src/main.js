import clientApplication from "./utils/clientApplication.js";
import configureElements from "./utils/configureElements.js";
import { handleAuthentication, handleFullscreen, handleModeToggle, handleWindowToggle, setupLoginButton } from "./utils/helper.js";
import renderWebChat from "./utils/renderWebChat.js";
import { isAuthenticated, isTokenExpired, onSignIn } from "./utils/rootScript.js";

(function () {
  configureElements()
  setupLoginButton()
  handleAuthentication()
  handleWindowToggle()
  import.meta.env.VITE_ENABLE_FULLSCREEN === '1' && handleFullscreen()
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

// TEMP
if (null && window.top !== window.self) {
  // Iframe Script
  function adjustBodySize(width, height) {
    // document.body.style.width = `${width}px`;
    document.body.style.height = `${height}px`;
  }

  // Listen for messages from the parent window
  window.addEventListener('message', (event) => {
    // Adjust the iframe body based on the parent's dimensions
    const { width, height, source } = event.data;
    if (source !== 'bot-iframe-container') { return }

    // TEMP
    console.log('Received from parent', event.data)

    adjustBodySize(width, height);
  });

  // Function to send the iframe's content size to the parent window
  function sendIframeSize() {
    const data = {
      width: document.body.scrollWidth,
      height: document.body.scrollHeight,
      source: 'bot-iframe'
    };
    window.parent.postMessage(data, '*'); // Send dimensions to parent window
  }

  // Monitor changes in content size and send updates to the parent window
  const resizeObserver = new ResizeObserver(sendIframeSize);
  resizeObserver.observe(document.querySelector('#chat-window'));

  // Initial sending of iframe size
  sendIframeSize();

}


