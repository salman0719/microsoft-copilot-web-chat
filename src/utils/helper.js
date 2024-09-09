import { h, render } from 'preact';
import { postMessageToParent } from './actions.ts';
import {
  BOT_NAME,
  DEFAULT_SEND_BOX_ERROR_MESSAGE,
  DISCLOSURE_TEXT,
  FULLSCREEN_SEARCH_QUERY_KEY,
  INPUT_CHAR_LIMIT,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from './constants.ts';
import { isAuthenticated, onSignInClick } from './rootScript.js';
import { getData, getElement, isClosed, isCondensed, setData, subscribe } from './store.ts';
import InputCounter from '../components/InputCounter/index.tsx';

export const insertDisclosureText = () => {
  const sendBoxElem = document.querySelector('#webchat .webchat__send-box');
  const disclosureText = document.createElement('div');
  disclosureText.innerHTML = DISCLOSURE_TEXT;
  disclosureText.className = 'webchat__send-box__info';
  sendBoxElem.appendChild(disclosureText);
};

export const updateInputPlaceholder = () => {
  document.querySelector('#webchat .webchat__send-box-text-box__input').placeholder =
    'Message ' + BOT_NAME;
};

export const handleAuthentication = () => {
  const container = getElement('container');
  const res = subscribe(['authenticated'], () => {
    container.classList[getData('authenticated') ? 'remove' : 'add'](
      'chat-window--unauthenticated'
    );
  });

  isAuthenticated();

  return res;
};

export const handleCondensation = (isNewSession) => {
  // TODO
  // Take it elsewhere
  if (
    getData('isFullscreen') ||
    (!isNewSession && localStorage.getItem(WEBCHAT_WINDOW_CONDENSED_KEY) !== '1')
  ) {
    isCondensed.value = false;
    return;
  } else {
    isCondensed.value = true;
  }
};

export const insertInputCounter = () => {
  render(h(InputCounter), document.querySelector('#chat-window .webchat__send-box__main'));
};

export const handleWebchatInitialization = () => {
  const container = getElement('container');
  setData(
    'webchatInitialized',
    !container.classList.contains('chat-window--webchat-uninitialized')
  );

  return subscribe(['webchatInitialized'], () => {
    container.classList[getData('webchatInitialized') ? 'remove' : 'add'](
      'chat-window--webchat-uninitialized'
    );
  });
};

export const setupLoginButton = () => {
  getElement('loginScreen').querySelector('.login-button').addEventListener('click', onSignInClick);
};

export const handleUsername = () => {
  return subscribe(['username'], () => {
    document.querySelector('#chat-window .chat-window__navbar__mode-username').innerHTML =
      getData('username');
  });
};

export const getSendBoxErrorInfo = () => {
  return 'Maximum limit of ' + INPUT_CHAR_LIMIT + ' characters reached.';
};

export const handleInput = () => {
  const store = getData('webChatStore');

  store.subscribe(() => {
    setData('sendBoxValue', store.getState().sendBoxValue);
  });

  const sendBoxErrorInfoElem = getElement('sendBoxErrorInfoElem');
  sendBoxErrorInfoElem.className = 'webchat__send-box__error-info';
  sendBoxErrorInfoElem.innerHTML = DEFAULT_SEND_BOX_ERROR_MESSAGE;
  document
    .querySelector('#chat-window .webchat__send-box')
    .insertAdjacentElement('beforebegin', sendBoxErrorInfoElem);

  const submitBtn = document.querySelector('#chat-window .webchat__send-box__button');

  return [
    subscribe(['sendBoxValue'], (value) => {
      setData('charLimitExceeded', value.length > INPUT_CHAR_LIMIT);
    }),
    subscribe(['charLimitExceeded'], () => {
      if (getData('charLimitExceeded')) {
        sendBoxErrorInfoElem.classList.remove('webchat__send-box__error-info--hidden');
        submitBtn.disabled = true;
      } else {
        sendBoxErrorInfoElem.classList.add('webchat__send-box__error-info--hidden');
        submitBtn.disabled = false;
      }
    }),
  ];
};

export const handleConversationResize = () => {
  const container = getElement('container');
  const conversationContainer = container.querySelector('.webchat__basic-transcript__scrollable');

  function sendIframeSize() {
    const containerHeight = container.offsetHeight;
    const conversationHeight = conversationContainer.offsetHeight;

    const data = {
      height: containerHeight - conversationHeight + conversationContainer.scrollHeight + 10,
      type: 'conversationResize',
    };

    postMessageToParent(data);
  }

  const resizeObserver = new ResizeObserver(sendIframeSize);
  resizeObserver.observe(conversationContainer);

  sendIframeSize();
};
