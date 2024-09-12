import { render } from 'preact';
import Container from '../components/Container/index.tsx';
import { container } from './store.ts';
import { ELEMENT_ID } from './constants.tsx';

export default function configureElements() {
  render(<Container />, document.body);
  container.value = document.querySelector('#' + ELEMENT_ID);
}
