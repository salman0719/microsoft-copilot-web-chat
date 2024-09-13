import { FunctionalComponent } from 'preact';
import { DISCLOSURE_TEXT } from '../../utils/constants';
import { createPortal } from 'preact/compat';
import { useInsertElement } from '../../utils/hooks';

const DisclosureText: FunctionalComponent = () => {
  const node = useInsertElement<HTMLDivElement>('.webchat__send-box');

  return node.value
    ? createPortal(<div className='webchat__send-box__info'>{DISCLOSURE_TEXT}</div>, node.value)
    : null;
};

export default DisclosureText;
