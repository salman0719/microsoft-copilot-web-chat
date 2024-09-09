import { h, render } from 'preact';
import Container from '../components/Container/index.tsx';
import { setElement } from './store.ts';

export default function configureElements() {
  render(h(Container, null), document.body);

  const container = document.querySelector('#chat-window');
  const modeButton = document.querySelector('#chat-window .chat-window__navbar__mode-button');

  if (!container || !modeButton) {
    throw new Error('Failed to configure elements.');
  }

  const loginScreen = container.querySelector('#login-screen');

  if (!loginScreen) {
    throw new Error('Failed to configure elements.');
  }

  setElement('container', container);
  setElement('modeButton', modeButton);
  setElement('loginScreen', loginScreen);
}
