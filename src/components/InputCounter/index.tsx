import { FunctionalComponent } from 'preact';
import {
  container,
  sendBoxChatLimitCrossed,
  sendBoxValue,
  webchatInitialized,
} from '../../utils/store';
import { INPUT_CHAR_LIMIT } from '../../utils/constants';
import { effect, useComputed } from '@preact/signals';
import classNames from 'classnames';
import { createPortal } from 'preact/compat';

const Root: FunctionalComponent = () => {
  const className = useComputed(() =>
    classNames(
      'webchat__send-box-text-box-counter',
      sendBoxChatLimitCrossed.value && ' webchat__send-box-text-box-counter--error'
    )
  );

  const text = useComputed(() => sendBoxValue.value.length + '/' + INPUT_CHAR_LIMIT);

  return <span className={className}>{text}</span>;
};

const InputCounter: FunctionalComponent = () => {
  const node = useComputed<HTMLDivElement | undefined>(() => {
    if (!webchatInitialized.value || !container.value) {
      return;
    }

    const parent = container.value.querySelector('.webchat__send-box__main');
    if (!parent) {
      return;
    }

    const div = document.createElement('div');
    div.style.display = 'contents';
    parent.insertBefore(div, parent.lastElementChild);

    return div;
  });

  effect(() => {
    const nodeValue = node.value;
    return () => nodeValue?.remove();
  });

  return node.value ? createPortal(<Root />, node.value) : null;
};

export default InputCounter;
