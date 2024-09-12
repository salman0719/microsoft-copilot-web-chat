import { FunctionalComponent, JSX } from 'preact';
import { BOT_NAME, ELEMENT_ID } from '../../utils/constants.tsx';
import loginBotIconSrc from '../../images/login-bot-icon.png';
import classNames from 'classnames';
import {
  webchatInitialized,
  isClosed as rootIsClosed,
  isDark,
  isCondensed,
  isFullscreen,
  authenticated,
  container,
  username,
} from '../../utils/store.ts';
import { effect, useComputed, useSignal } from '@preact/signals';
import ExpandIcon from '../ExpandIcon/index.tsx';
import InputCounter from '../InputCounter/index.tsx';
// TODO
// @ts-expect-error: We haven't converted the script to ts yet
import { onSignInClick } from '../../utils/rootScript.js';
import DisclosureText from '../DisclosureText/index.tsx';
import ErrorMessages from '../ErrorMessages/index.tsx';
import { stopPropagation } from '../../utils/helper.ts';
import { useEffect } from 'preact/hooks';

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
      authenticatedValue === false && 'chat-window--unauthenticated',
      fullscreenValue && 'chat-window--fullscreen',
      !fullscreenValue && authenticatedValue && isCondensed.value && 'chat-window--condensed',
      isClosed.value && 'chat-window--closed',
      !webchatInitialized.value && 'chat-window--webchat-uninitialized',
      authenticatedValue && isDark.value && 'chat-window--dark'
    );
  });

  const uncondense = (isCondensed.value && (() => (isCondensed.value = false))) || void 0;

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

  useEffect(() => {
    container.value = document.querySelector('#' + ELEMENT_ID);
    return () => (container.value = null);
  }, []);

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
        {/* // TODO */}
        {/* Need to refactor the old login-screen implementation */}
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
      <ErrorMessages />
      <DisclosureText />
    </div>
  );
};

export default Container;
