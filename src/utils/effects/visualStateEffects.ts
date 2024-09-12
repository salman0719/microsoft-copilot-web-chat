import { effect } from '@preact/signals';
import { container, isClosed, isCondensed, isDark, isFullscreen } from '../store';
import {
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from '../constants';

effect(() => {
  isDark.value
    ? localStorage.setItem(WEBCHAT_MODE_KEY, '1')
    : localStorage.removeItem(WEBCHAT_MODE_KEY);
});

effect(() => {
  isClosed.value
    ? localStorage.setItem(WEBCHAT_WINDOW_CLOSED_KEY, '1')
    : localStorage.removeItem(WEBCHAT_WINDOW_CLOSED_KEY);
});

effect(() => {
  isCondensed.value
    ? localStorage.setItem(WEBCHAT_WINDOW_CONDENSED_KEY, '1')
    : localStorage.removeItem(WEBCHAT_WINDOW_CONDENSED_KEY);

  !isCondensed.value &&
    setTimeout(() => {
      container.value
        ?.querySelector<HTMLInputElement>('.webchat__send-box-text-box__input')
        ?.focus();
    });
});

effect(() => {
  if (isFullscreen.value) {
    isClosed.value = false;
    isCondensed.value = false;
  }
});

const disposeIsClosedEffect = effect(() => {
  if (isClosed.value) {
    return () => {
      isCondensed.value = false;
      disposeIsClosedEffect();
    };
  }
});
