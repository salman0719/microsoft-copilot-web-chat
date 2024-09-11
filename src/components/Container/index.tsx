import { FunctionalComponent, JSX } from 'preact';
import {
  BOT_NAME,
  ELEMENT_ID,
  WEBCHAT_MODE_KEY,
  WEBCHAT_WINDOW_CLOSED_KEY,
  WEBCHAT_WINDOW_CONDENSED_KEY,
} from '../../utils/constants.ts';
import loginBotIconSrc from '../../images/login-bot-icon.png';
import classNames from 'classnames';
import {
  webchatInitialized,
  isClosed as rootIsClosed,
  isDark,
  isCondensed,
  isFullscreen,
  authenticated,
  webchatStore,
  sendBoxValue,
  container,
  username,
} from '../../utils/store.ts';
import { effect, useComputed, useSignal } from '@preact/signals';
import ExpandIcon from '../ExpandIcon/index.tsx';
import InputCounter from '../InputCounter/index.tsx';
import InputError from '../InputError/index.tsx';
// TODO
// @ts-expect-error: We haven't converted the script to ts yet
import { onSignInClick } from '../../utils/rootScript.js';
import DisclosureText from '../DisclosureText/index.tsx';

// TODO
// Group the following and other effects from other files and take them to
// a different source
effect(() => {
  isDark.value
    ? localStorage.setItem(WEBCHAT_MODE_KEY, '1')
    : localStorage.removeItem(WEBCHAT_MODE_KEY);
});

effect(() => {
  rootIsClosed.value
    ? localStorage.setItem(WEBCHAT_WINDOW_CLOSED_KEY, '1')
    : localStorage.removeItem(WEBCHAT_WINDOW_CLOSED_KEY);
});

effect(() => {
  isCondensed.value
    ? localStorage.setItem(WEBCHAT_WINDOW_CONDENSED_KEY, '1')
    : localStorage.removeItem(WEBCHAT_WINDOW_CONDENSED_KEY);
});

const disposeIsClosedEffect = effect(() => {
  if (rootIsClosed.value) {
    return () => {
      isCondensed.value = false;
      disposeIsClosedEffect();
    };
  }
});

const stopPropagation = (e: Event) => {
  e.stopPropagation();
};

const Container: FunctionalComponent = () => {
  const isBodyHidden = useSignal<boolean>(false);
  const bodyClassName = useComputed<string>(() =>
    classNames('chat-window__body', isBodyHidden.value && 'chat-window__body--hidden')
  );
  const isClosed = useSignal<boolean>(rootIsClosed.peek());

  const className = useComputed(() => {
    const authenticatedValue = authenticated.value;
    const fullscreenValue = isFullscreen.value;

    return classNames(
      !authenticatedValue && 'chat-window--unauthenticated',
      fullscreenValue && 'chat-window--fullscreen',
      !fullscreenValue && authenticatedValue && isCondensed.value && 'chat-window--condensed',
      isClosed.value && 'chat-window--closed',
      !webchatInitialized.value && 'chat-window--webchat-uninitialized',
      authenticatedValue && isDark.value && 'chat-window--dark'
    );
  });

  const uncondense = (isCondensed.value && (() => (isCondensed.value = false))) || void 0;

  effect(() => {
    const store = webchatStore.value;
    if (!store) {
      return;
    }

    // @ts-expect-error: We're not using WebChat's ts library yet
    return store.subscribe(() => {
      // @ts-expect-error: We're not using WebChat's ts library yet
      const newSendBoxValue = store.getState().sendBoxValue;
      if (newSendBoxValue !== sendBoxValue.value) {
        sendBoxValue.value = newSendBoxValue;
      }
    });
  });

  effect(() => {
    !isCondensed.value &&
      setTimeout(() => {
        container.value
          ?.querySelector<HTMLInputElement>('.webchat__send-box-text-box__input')
          ?.focus();
      });
  });

  effect(() => {
    setTimeout(() => {
      isClosed.value = rootIsClosed.value;
    }, 1);

    if (rootIsClosed.value) {
      const isBodyHiddenTimeoutId = setTimeout(() => {
        isBodyHidden.value = true;
        // @ts-expect-error: This value will come from vite's `define`
      }, __CHAT_WINDOW_TRANSITION_DURATION_MS__);
      return () => clearTimeout(isBodyHiddenTimeoutId);
    } else {
      isBodyHidden.value = false;
    }
  });

  return (
    <div id={ELEMENT_ID} className={className}>
      <div
        className={bodyClassName}
        onTouchStart={uncondense}
        onMouseDown={uncondense}
        onKeyDown={uncondense}
      >
        <div className='chat-window__navbar'>
          <div className='chat-window__navbar__title'>{BOT_NAME}</div>
          <div className='chat-window__navbar__filler'></div>
          <div
            onClick={() => {
              isDark.value = !isDark.value;
            }}
            className='chat-window__navbar__mode-button'
          />
          {import.meta.env.VITE_ENABLE_FULLSCREEN === '1' && <ExpandIcon />}
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='chat-window__navbar__collapse-icon'
            onTouchStart={stopPropagation}
            onMouseDown={stopPropagation}
            onClick={(e: JSX.TargetedMouseEvent<SVGSVGElement>) => {
              stopPropagation(e);
              rootIsClosed.value = true;
            }}
          >
            <path
              d='M5 7.5L10 12.5L15 7.5'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          <div className='chat-window__navbar__mode-username'>{username}</div>
        </div>
        <div id='webchat'></div>
        <div id='login-screen'>
          <div>
            <img src={loginBotIconSrc} id='login-upper-image' />
            <p style='text-align:center;'>
              <span style='font-size:20px;font-weight: 700;line-height: 32px;'>
                Chat with {BOT_NAME}
              </span>
            </p>
            <ul style='width: 100%;font-weight: 400; line-height: 24px;'>
              <li>24/7 educational technology support</li>
              <li>Easy access to EdTech Hub</li>
            </ul>
          </div>
          <div>
            <button className='login-button' onClick={onSignInClick}>
              Start conversation
            </button>
          </div>
        </div>
      </div>
      <div id='webchat-bot' onClick={() => (rootIsClosed.value = !rootIsClosed.value)}></div>
      <InputCounter />
      <InputError />
      <DisclosureText />
    </div>
  );
};

export default Container;
