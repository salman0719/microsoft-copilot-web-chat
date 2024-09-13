import { effect } from '@preact/signals';
import {
  authenticated,
  isClosed,
  isCondensed,
  isDark,
  isFullscreen,
  isWebchatActive,
  username,
  webchatInitialized,
} from '../store';
import { IS_WINDOW_EMBEDDED } from '../constants';
import { SetDataPostMessageProps } from '../types';
import { postMessageToParent } from '../helper';

// @ts-expect-error: This will come from vite config's `define` attribute
if (__IS_EMBED_CHILD__) {
  const broadcastEffect = (key: string, value: unknown, oldValue: unknown) => {
    if (!IS_WINDOW_EMBEDDED) {
      return;
    }

    if (!['string', 'number', 'boolean'].includes(typeof value)) {
      return;
    }

    const data: SetDataPostMessageProps = {
      key,
      oldValue,
      value,
      type: 'setData',
    };

    postMessageToParent(data);
  };

  const broadcastSignals = {
    webchatInitialized,
    authenticated,
    isClosed,
    isDark,
    isCondensed,
    isFullscreen,
    username,
    isWebchatActive,
  };

  for (const [key, signalObj] of Object.entries(broadcastSignals)) {
    let oldValue: typeof signalObj.value;
    effect(() => {
      broadcastEffect(key, signalObj.value, oldValue);
      oldValue = signalObj.peek();
    });
  }
}
