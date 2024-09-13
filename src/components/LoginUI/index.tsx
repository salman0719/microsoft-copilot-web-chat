import { FunctionalComponent, JSX } from 'preact';
import { BOT_NAME, MSAL_SCOPES } from '../../utils/constants';
import loginBotIconSrc from '../../images/login-bot-icon.png';
import clientApplication from '../../utils/clientApplication';
import { authenticated } from '../../utils/store';

const LoginUI: FunctionalComponent = () => {
  const onSignInClick: JSX.MouseEventHandler<HTMLButtonElement> = () => {
    let requestObj = {
      scopes: MSAL_SCOPES,
    };

    clientApplication
      .loginPopup(requestObj)
      .then(function (response: Record<string, unknown>) {
        clientApplication.setActiveAccount(response.account);
        authenticated.value = true;
      })
      .catch(function (error: unknown) {
        console.log(error);
      });
  };

  return (
    <div id='login-screen'>
      <div>
        <img src={loginBotIconSrc} id='login-upper-image' />
        <div className='login-bot-name'>Chat with {BOT_NAME}</div>
        <ul className='login-bot-features'>
          <li>24/7 educational technology support</li>
          <li>Easy access to EdTech Hub</li>
        </ul>
      </div>
      <div>
        <button className='login-button' onClick={onSignInClick}>
          Start conversation
        </button>
      </div>
    </div>
  );
};

export default LoginUI;
