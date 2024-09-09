import { FunctionalComponent } from 'preact';
import { DEFAULT_SEND_BOX_ERROR_MESSAGE } from '../../utils/constants';
import { effect, useComputed } from '@preact/signals';
import { container, sendBoxChatLimitCrossed, webchatInitialized } from '../../utils/store';
import { createPortal } from 'preact/compat';
import classNames from 'classnames';

const Root: FunctionalComponent = () => {
  const submitBtn = useComputed<HTMLButtonElement | null | undefined>(() =>
    container.value?.querySelector('.webchat__send-box__button')
  );

  const errorMessage = useComputed(() => {
    return sendBoxChatLimitCrossed.value ? DEFAULT_SEND_BOX_ERROR_MESSAGE : '';
  });

  const className = useComputed(() =>
    classNames(
      'webchat__send-box__error-info',
      !sendBoxChatLimitCrossed.value && 'webchat__send-box__error-info--hidden'
    )
  );

  effect(() => {
    const submitBtnValue = submitBtn.value;
    const hasErrorValue = sendBoxChatLimitCrossed.value;

    if (!submitBtnValue) {
      return;
    }

    submitBtnValue.disabled = hasErrorValue;
  });

  return <div className={className}>{errorMessage}</div>;
};

const InputError: FunctionalComponent = () => {
  const node = useComputed<HTMLDivElement | undefined>(() => {
    if (!webchatInitialized.value || !container.value) {
      return;
    }

    const parent = container.peek()?.querySelector('.webchat__send-box');
    if (!parent) {
      return;
    }

    const div = document.createElement('div');
    div.style.display = 'contents';

    parent.insertAdjacentElement('beforebegin', div);

    return div;
  });

  effect(() => {
    const nodeValue = node.value;
    return () => nodeValue?.remove();
  });

  return node.value ? createPortal(<Root />, node.value) : null;
};

export default InputError;
