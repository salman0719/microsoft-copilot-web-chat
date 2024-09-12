import { isAuthenticated } from './utils/rootScript.js';
import configureElements from './utils/configureElements.tsx';
import './utils/effects/visualStateEffects.ts';
import './utils/effects/webchatEffects.ts';
import './utils/effects/postMessageEffects.ts';
import './utils/windowQueueHandler.ts';

document.documentElement.style.setProperty(
  '--chat-window-transition-duration-ms',
  __CHAT_WINDOW_TRANSITION_DURATION_MS__
);

configureElements();
isAuthenticated();
