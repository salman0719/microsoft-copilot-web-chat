import { FunctionalComponent } from 'preact';
import { sendBoxChatLimitCrossed, sendBoxValue } from '../../utils/store';
import { INPUT_CHAR_LIMIT } from '../../utils/constants';
import { useComputed } from '@preact/signals';
import classNames from 'classnames';
import { createPortal } from 'preact/compat';
import { useInsertElement } from '../../utils/hooks';

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
  const node = useInsertElement<HTMLDivElement>('.webchat__send-box__main > *:last-child', true);

  return node.value ? createPortal(<Root />, node.value) : null;
};

export default InputCounter;
