import configureElements from './utils/configureElements';
import './utils/effects/visualStateEffects';
import './utils/effects/webchatEffects';
import './utils/effects/postMessageEffects';
import './utils/windowQueueHandler';
import { isAuthenticated } from './utils/clientApplication';

document.documentElement.style.setProperty(
  '--chat-window-transition-duration-ms',
  // @ts-expect-error: Comes from vite's `define` attribute
  __CHAT_WINDOW_TRANSITION_DURATION_MS__
);

configureElements();
isAuthenticated();
