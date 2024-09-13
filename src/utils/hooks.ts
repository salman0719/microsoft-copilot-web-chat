import { computed, effect, useComputed } from '@preact/signals';
import { container, webchatInitialized } from './store';

const getElement = <Elem extends HTMLElement>(selector: string) => {
  const initialized = webchatInitialized.value;
  const root = container.value;
  if (!root || !initialized) {
    return;
  }
  const node = root.querySelector<Elem>(selector);
  if (!node) {
    return;
  }

  return node;
};

export const computedElement = <Elem extends HTMLElement>(selector: string) =>
  computed<Elem | void>(() => {
    return getElement<Elem>(selector);
  });

export const useInsertElement = <Elem extends HTMLElement>(
  selector: string,
  shouldInsertBefore: boolean = false
) => {
  const parent = useComputed<Elem | void>(() => {
    return getElement<Elem>(selector);
  });

  const node = useComputed<HTMLDivElement | void>(() => {
    const parentValue = parent.value;
    if (!parentValue) {
      return;
    }

    const div = document.createElement('div');
    div.style.display = 'contents';

    shouldInsertBefore
      ? parentValue.parentNode?.insertBefore(div, parentValue)
      : parentValue.appendChild(div);

    return div;
  });

  effect(() => {
    const nodeValue = node.value;
    return () => nodeValue?.remove();
  });

  return node;
};
