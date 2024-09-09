import { FunctionalComponent } from 'preact';
import { container, webchatInitialized } from '../../utils/store';
import { DISCLOSURE_TEXT } from '../../utils/constants';
import { effect, useComputed } from '@preact/signals';
import { createPortal } from 'preact/compat';

const DisclosureText: FunctionalComponent = () => {
  const node = useComputed<HTMLDivElement | undefined>(() => {
    if (!webchatInitialized.value || !container.value) {
      return;
    }

    const parent = container.value.querySelector('.webchat__send-box');
    if (!parent) {
      return;
    }

    const div = document.createElement('div');
    div.style.display = 'contents';
    parent.appendChild(div);

    return div;
  });

  effect(() => {
    const nodeValue = node.value;
    return () => nodeValue?.remove();
  });

  return node.value
    ? createPortal(<div className='webchat__send-box__info'>{DISCLOSURE_TEXT}</div>, node.value)
    : null;
};

export default DisclosureText;
