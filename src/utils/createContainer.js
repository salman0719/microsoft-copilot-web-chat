import { BOT_NAME } from "./constants.js";

export default function createContainer() {
  const html = `
  <div id="chat-window" class="chat-window--closed">
    <div class="chat-window__body">
      <div class="chat-window__navbar">
        <div class="chat-window__navbar__title">${BOT_NAME}</div>
        <div class="chat-window__navbar__filler"></div>
        <div class="chat-window__navbar__mode-button"></div>
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
          class="chat-window__navbar__expand-icon">
          <path
            d="M18.75 3.75H26.25M26.25 3.75V11.25M26.25 3.75L17.5 12.5M11.25 26.25H3.75M3.75 26.25V18.75M3.75 26.25L12.5 17.5"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
          class="chat-window__navbar__collapse-icon">
          <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
        <div class="chat-window__navbar__mode-username"></div>
      </div>
      <div id="webchat"></div>
    </div>
    <div id="webchat-bot"></div>
  </div>
  `

  document.body.insertAdjacentHTML('beforeend', html)
}
