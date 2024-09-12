import { render } from 'preact';
import Container from '../components/Container/index.tsx';

export default function configureElements() {
  render(<Container />, document.body);
}
