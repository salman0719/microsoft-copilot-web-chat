import renderMarkup from "./utils/renderMarkup";

(function () {
  renderMarkup()

  const iframe = document.querySelector('#bot-iframe-wrapper>iframe.bot-iframe');
  const parent = iframe.parentNode

  const store = {}

  window.addEventListener('message', (event) => {
    if (event.source !== iframe.contentWindow) { return }

    const { data } = event
    const { type } = data;

    if (type === 'setData') {
      const { key, value } = data

      store[key] = value

      if (key === 'isCondensed') {
        parent.classList[value ? 'add' : 'remove']('bot-iframe--condensed')
      } else if (key === 'authenticated') {
        parent.classList[value ? 'remove' : 'add']('bot-iframe--unauthenticated')
      } else if (key === 'isClosed') {
        if (!value) {
          parent.classList['remove']('bot-iframe--closed')
        } else {
          setTimeout(() => {
            store.isClosed === value &&
              parent.classList.add('bot-iframe--closed')
            // TODO
            // Use constant
          }, 300)
        }
      }
    } else if (type === 'conversationResize') {
      const { height } = data

      if (!store.authenticated) {
        parent.style.removeProperty('height')
        return
      }

      if (store.isClosed) { return }

      // TODO
      // Use constant
      parent.style.height = Math.max(height, 335) + 'px'
    }

  });
})()