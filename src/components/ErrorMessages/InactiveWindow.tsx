import { FunctionalComponent } from 'preact';
import { isWebchatActive } from '../../utils/store';

const InactiveWindowErrorMessage: FunctionalComponent = () => {
  return (
    <span>
      Conversation moved to another window.{' '}
      <span onClick={() => (isWebchatActive.value = true)} className='chat-window__reload-link'>
        Reload
      </span>{' '}
      to take control again.
    </span>
  );
};

export default InactiveWindowErrorMessage;
