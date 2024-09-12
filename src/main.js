import configureElements from './utils/configureElements.tsx';
import { isAuthenticated, onSignIn } from './utils/rootScript.js';
import './utils/windowQueueHandler.ts';

document.documentElement.style.setProperty(
  '--chat-window-transition-duration-ms',
  __CHAT_WINDOW_TRANSITION_DURATION_MS__
);

configureElements();

isAuthenticated().then(function (authenticated) {
  authenticated && onSignIn();
});
