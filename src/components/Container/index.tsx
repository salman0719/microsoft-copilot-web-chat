import { FunctionalComponent } from "preact";
import { BOT_NAME } from "../../utils/constants.ts";
import loginBotIconSrc from "../../images/login-bot-icon.png";

const Container: FunctionalComponent = () => {
  return (
    <div id="chat-window" className="chat-window--webchat-uninitialized chat-window--closed">
      <div className="chat-window__body">
        <div className="chat-window__navbar">
          <div className="chat-window__navbar__title">{BOT_NAME}</div>
          <div className="chat-window__navbar__filler"></div>
          <div className="chat-window__navbar__mode-button"></div>
          {import.meta.env.ENABLE_FULLSCREEN === '1' &&
            <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"
              className="chat-window__navbar__expand-icon">
              <path
                d="M18.75 3.75H26.25M26.25 3.75V11.25M26.25 3.75L17.5 12.5M11.25 26.25H3.75M3.75 26.25V18.75M3.75 26.25L12.5 17.5"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          }
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"
            className="chat-window__navbar__collapse-icon">
            <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" />
          </svg>
          <div className="chat-window__navbar__mode-username"></div>
        </div>
        <div id="webchat"></div>
        <div id="login-screen">
          <div>
            <img src={loginBotIconSrc} id="login-upper-image" />
            <p style="text-align:center;">
              <span style="font-size:20px;font-weight: 700;line-height: 32px;">Chat with {BOT_NAME}</span>
            </p>
            <ul style="width: 100%;font-weight: 400; line-height: 24px;">
              <li>24/7 educational technology support</li>
              <li>Easy access to EdTech Hub</li>
            </ul>
          </div>
          <div>
            <button className="login-button">Start conversation</button>
          </div>
        </div>
      </div>
      <div id="webchat-bot"></div>
    </div>
  )
}

export default Container;