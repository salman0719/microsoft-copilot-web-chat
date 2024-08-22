(function () {
  const iframe = document.querySelector('#bot-iframe-wrapper>iframe.bot-iframe');

  const store = {}

  window.addEventListener('message', (event) => {
    // TODO
    // Use constant
    // if (event.origin !== 'http://iframe-origin.com') return; 
    const { data } = event
    const { source, type } = data;
    if (source !== 'bot-iframe') { return }

    if (type === 'setData') {
      const { key, value } = data

      store[key] = value

      if (key === 'isCondensed') {
        iframe.classList[value ? 'add' : 'remove']('bot-iframe--condensed')
      } else if (key === 'authenticated') {
        iframe.classList[value ? 'remove' : 'add']('bot-iframe--unauthenticated')
      } else if (key === 'isClosed') {
        if (!value) {
          iframe.classList['remove']('bot-iframe--closed')
        } else {
          setTimeout(() => {
            const curValue = store.isClosed
            iframe.classList[curValue ? 'add' : 'remove']('bot-iframe--closed')
            // TODO
            // Use constant
          }, 300)
        }
      }
    } else if (type === 'conversationResize') {
      const { height } = data

      if (!store.authenticated) {
        iframe.style.removeProperty('height')
        return
      }

      if (store.isClosed) { return }

      // TODO
      // Use constant
      iframe.style.height = Math.max(height, 350) + 'px'
    }

  });
})()
