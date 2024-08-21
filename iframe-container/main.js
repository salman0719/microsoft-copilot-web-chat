// console.log('window', window)
// console.log('window.parent', window.parent)

(function () {
  const iframe = document.querySelector('#bot-iframe-wrapper>iframe.bot-iframe');

  window.addEventListener('message', (event) => {
    // TEMP
    // if (event.origin !== 'http://iframe-origin.com') return; // Replace with your iframe's origin
    const { key, value, source } = event.data;
    if (source !== 'bot-iframe') { return }

    if (key === 'isCondensed') {
      iframe.classList[value ? 'add' : 'remove']('bot-iframe--condensed')
    }

    // TEMP
    console.log('Received from child', 'key', key, 'value', value)
  });

  return

  // Parent Window Script

  // Function to send the parent window's dimensions to the iframe
  function sendParentDimensions() {
    const data = {
      width: window.innerWidth,
      height: window.innerHeight,
      source: 'bot-iframe-container'
    };
    iframe.contentWindow.postMessage(data, '*'); // Send dimensions to iframe
  }

  // Listen for window resize events and send dimensions to iframe
  window.addEventListener('resize', sendParentDimensions);

  // Listen for messages from the iframe
  window.addEventListener('message', (event) => {
    // TEMP
    // if (event.origin !== 'http://iframe-origin.com') return; // Replace with your iframe's origin
    const { width, height, source } = event.data;
    if (source !== 'bot-iframe') { return }
    // Adjust the iframe's dimensions based on its content
    // iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;

    // TEMP
    console.log('Received from child', event.data)
  });

  // Initial sending of dimensions
  sendParentDimensions();

})()
