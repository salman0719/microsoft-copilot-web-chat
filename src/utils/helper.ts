import { BOT_NAME, TARGET_ORIGIN } from './constants.ts';
import { container } from './store.ts';

export const updateInputPlaceholder = () => {
  const root = container.value;
  if (!root) {
    return;
  }
  const input = root.querySelector<HTMLInputElement>('.webchat__send-box-text-box__input');
  if (!input) {
    return;
  }

  input.placeholder = 'Message ' + BOT_NAME;
};

export interface ResizePostMessageProps {
  height: number;
  type: 'conversationResize';
}
export interface SetDataPostMessageProps {
  key: string;
  oldValue: unknown;
  value: unknown;
  type: 'setData';
}
type PostMessageProps = ResizePostMessageProps | SetDataPostMessageProps;

export const postMessageToParent = (data: PostMessageProps) => {
  window.parent.postMessage(data, TARGET_ORIGIN);
};

export const observeConversationResize = () => {
  const root = container.value;
  if (!root) {
    return;
  }

  const conversationContainer = root.querySelector<HTMLDivElement>(
    '.webchat__basic-transcript__scrollable'
  );
  if (!conversationContainer) {
    return;
  }

  const sendIframeSize = () => {
    const containerHeight = root.offsetHeight;
    const conversationHeight = conversationContainer.offsetHeight;

    const data: ResizePostMessageProps = {
      height: containerHeight - conversationHeight + conversationContainer.scrollHeight + 10,
      type: 'conversationResize',
    };

    postMessageToParent(data);
  };

  const resizeObserver = new ResizeObserver(sendIframeSize);
  resizeObserver.observe(conversationContainer);

  sendIframeSize();

  return () => resizeObserver.disconnect();
};
