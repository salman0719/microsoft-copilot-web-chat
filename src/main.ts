import configureElements from './utils/configureElements';
import './utils/effects/visualStateEffects';
import './utils/effects/webchatEffects';
import './utils/effects/postMessageEffects';
import './utils/windowQueueHandler';
import { isAuthenticated } from './utils/clientApplication';

configureElements();
isAuthenticated();
