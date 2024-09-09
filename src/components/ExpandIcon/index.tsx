import { FunctionalComponent } from 'preact';
import { FULLSCREEN_SEARCH_QUERY_KEY } from '../../utils/constants';
import { effect } from '@preact/signals';
import { isClosed, isFullscreen } from '../../utils/store';

effect(() => {
  if (isFullscreen.value) {
    isClosed.value = false;
  }
});

const ExpandIcon: FunctionalComponent = () => {
  const enableFullscreen = () => {
    const searchQuery = new URLSearchParams(location.search);
    searchQuery.set(FULLSCREEN_SEARCH_QUERY_KEY, '1');
    let newSearch = searchQuery.toString();
    if (newSearch) {
      newSearch = '?' + newSearch;
    }
    window.open(location.origin + location.pathname + newSearch + location.hash);
  };

  return (
    <svg
      width='30'
      height='30'
      viewBox='0 0 30 30'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
      className='chat-window__navbar__expand-icon'
      onClick={enableFullscreen}
    >
      <path
        d='M18.75 3.75H26.25M26.25 3.75V11.25M26.25 3.75L17.5 12.5M11.25 26.25H3.75M3.75 26.25V18.75M3.75 26.25L12.5 17.5'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  );
};

export default ExpandIcon;
