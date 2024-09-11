import clientApplication from './utils/clientApplication.js';
import configureElements from './utils/configureElements.tsx';
import { isAuthenticated, onSignIn } from './utils/rootScript.js';

(function () {
  document.documentElement.style.setProperty(
    '--chat-window-transition-duration-ms',
    __CHAT_WINDOW_TRANSITION_DURATION_MS__
  );

  configureElements();

  if (
    import.meta.env.MODE === 'development' &&
    (import.meta.env.VITE_USE_DUMMY_MODE === '1' || import.meta.env.VITE_IGNORE_AUTH === '1')
  ) {
    clientApplication.getActiveAccount = () => ({
      name: 'Jenny Smith',
    });
  }

  let oldToken = sessionStorage.getItem('oldToken');
  if (oldToken == undefined || oldToken == 'undefined') {
    oldToken = null;
  }

  isAuthenticated().then(function (authenticated) {
    authenticated && onSignIn();
  });
})();
