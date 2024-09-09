import { postMessageToParent } from './actions.ts';
import { BOT_NAME, DISCLOSURE_TEXT, INPUT_CHAR_LIMIT } from './constants.ts';
import { container } from './store.ts';

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

export const getSendBoxErrorInfo = () => {
  return 'Maximum limit of ' + INPUT_CHAR_LIMIT + ' characters reached.';
};

export const handleConversationResize = () => {
  const root = container.value;
  const conversationContainer = root.querySelector('.webchat__basic-transcript__scrollable');

  function sendIframeSize() {
    const containerHeight = root.offsetHeight;
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
