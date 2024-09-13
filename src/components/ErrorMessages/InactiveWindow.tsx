import { FunctionalComponent } from 'preact';

const InactiveWindowErrorMessage: FunctionalComponent = () => {
  return (
    <span>
      Conversation moved to another window.{' '}
      <span onClick={() => window.location.reload()} className='chat-window__reload-link'>
        Reload
      </span>{' '}
      to take control again.
    </span>
  );
};

export default InactiveWindowErrorMessage;
