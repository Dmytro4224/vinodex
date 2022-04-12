import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import styles from './social.module.css';
import facebookIcon from '../../assets/icons/facebook.svg';
import twitterIcon from '../../assets/icons/twitter.svg';
import googleIcon from '../../assets/icons/google.svg';
import twitchIcon from '../../assets/icons/twitch.svg';
import linkedin from '../../assets/icons/linkedin.png';
import discord from '../../assets/icons/discord.png';

interface ISocial extends IProps { }

class Social extends Component<ISocial & IBaseComponentProps> {
  render() {
    return (
      <ul className={styles.socialListWrap}>
        <li>
          <a href="https://www.facebook.com/vinodex/" target="_blank">
            <img width="20" height="20" src={facebookIcon} alt="facebook" />
          </a>
        </li>
        <li>
          <a href="https://twitter.com/dex_vino"  target="_blank">
            <img width="20" height="17" src={twitterIcon} alt="twitter" />
          </a>
        </li>
        <li>
          <a href="https://www.linkedin.com/company/vinodex/" target="_blank">
            <img width="18" height="18" src={linkedin} alt="Linkedin" />
          </a>
        </li>
        <li>
          <a href="https://discord.gg/ZEFfhJC8" target="_blank">
            <img width="18" height="19" src={discord} alt="Discord" />
          </a>
        </li>
      </ul>
    )
  }
}

export default withComponent(Social);
