import { FunctionalComponent } from 'preact';
import { effect, useComputed } from '@preact/signals';
import { container, errorMessages, webchatInitialized } from '../../utils/store';
import { createPortal } from 'preact/compat';

const Root: FunctionalComponent = () => {
  return (
    <>
      {errorMessages.value.map(({ id, text }) => {
        return (
          <div key={id} class='webchat__error-info'>
            <svg alt='' class='' height='16' viewBox='0 0 13.1 13.1' width='16'>
              <path
                d='M6.5,13C2.9,13,0,10.1,0,6.5S2.9,0,6.5,0S13,2.9,13,6.5S10.1,13,6.5,13z M6.1,3.5v4.3h0.9V3.5H6.1z M6.1,8.7v0.9h0.9V8.7H6.1z'
                fill-rule='evenodd'
              />
            </svg>
            {text}
          </div>
        );
      })}
    </>
  );
};

const ErrorMessages: FunctionalComponent = () => {
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

export default ErrorMessages;
