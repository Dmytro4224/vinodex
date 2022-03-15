import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import styles from './social.module.css';
import facebookIcon from '../../assets/icons/facebook.svg';
import twitterIcon from '../../assets/icons/twitter.svg';
import googleIcon from '../../assets/icons/google.svg';
import twitchIcon from '../../assets/icons/twitch.svg';

interface ISocial extends IProps { }

class Social extends Component<ISocial & IBaseComponentProps> {
  render() {
    return (
      <ul className={styles.socialListWrap}>
        <li className='disabled'>
          <a href="#">
            <img width="20" height="20" src={facebookIcon} alt="facebook" />
          </a>
        </li>
        <li className='disabled'>
          <a href="#">
            <img width="20" height="17" src={twitterIcon} alt="twitter" />
          </a>
        </li>
        <li className='disabled'>
          <a href="#">
            <img width="18" height="18" src={googleIcon} alt="google" />
          </a>
        </li>
        <li className='disabled'>
          <a href="#">
            <img width="18" height="19" src={twitchIcon} alt="twitch" />
          </a>
        </li>
      </ul>
    )
  }
}

export default withComponent(Social);