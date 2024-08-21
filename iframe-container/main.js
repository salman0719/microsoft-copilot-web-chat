(function () {
  const iframe = document.querySelector('#bot-iframe-wrapper>iframe.bot-iframe');

  const store = {}

  const stateHeightMapper = {
    'isCondensed': 375,
    'regular': 500,
  }

  window.addEventListener('message', (event) => {
    // TEMP
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
      }
    } else if (type === 'conversationResize') {
      const { height } = data

      const extraHeight = height - 80
      iframe.style.height = Math.max(
        Math.min(extraHeight, window.innerHeight - 80),
        stateHeightMapper[store.isCondensed ? 'isCondensed' : 'regular']
      ) + 'px'

    }

  });
})()
