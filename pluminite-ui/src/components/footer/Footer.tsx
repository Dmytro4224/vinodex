import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import styles from './footer.module.css';
import footerLogo from '../../assets/icons/logo-vine.svg';
import Social from "../social/Social";
import { NavLink } from "react-router-dom";
import InputSubscribe from "../inputSubscribe/InputSubscribe";

interface IFooter extends IProps { }

class Footer extends Component<IFooter & IBaseComponentProps> {
  private _version: string = `v2.17.0`;

  private get currentYear() {
    return new Date().getFullYear();
  }

  get accountId() {
    return this.props.near.user?.accountId || '';
  }

  private onClickProfileLinks = async (e: React.MouseEvent, to: string) => {
    if (!this.props.near.isAuth) {
      e.preventDefault();
      e.stopPropagation();
      this.props.near.signIn(to);
      return false;
    }
  }

  render() {
    return (
      <footer className={styles.footer}>
        <div className={`container ${styles.contentBox}`}>
          <div className={styles.footerInfoWrap}>
            <img className={styles.footerLogo} width="145" height="45" src={footerLogo} alt="logo" />

            <p className={styles.infoDesc}>
              Upgrading fine wine to the WEB 3.0 with NFTs.
            </p>

            <Social />
          </div>

          <div className={`${styles.footerLinksWrap} align-items-start`}>
            <div className={styles.myAccountLinks}>
              <p className={styles.linksTitle}>My Account</p>
              <ul className={styles.linksWrap}>
                <li>
                  <NavLink onClick={e => this.onClickProfileLinks(e, `/userProfile/${this.accountId}?tab=details`)} to={`/userProfile/${this.accountId}?tab=details`}>Profile</NavLink>
                </li>
                <li>
                  <NavLink onClick={e => this.onClickProfileLinks(e, `/userProfile/${this.accountId}?tab=birds`)} to={`/userProfile/${this.accountId}?tab=birds`}>My Auctions</NavLink>
                </li>
                <li>
                  <NavLink onClick={e => this.onClickProfileLinks(e, `/userProfile/${this.accountId}?tab=items`)} to={`/userProfile/${this.accountId}?tab=items`}>My Wine</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.linksTitle}>Company</p>
              <ul className={styles.linksWrap}>
                <li>
                  <a href='https://wagmi.vinodex.io/' target="_blank">About Us</a>
                </li>
                <li>
                  <a href='https://wagmi.vinodex.io/#team' target="_blank">Contact Us</a>
                </li>
              </ul>
            </div>
          </div>

          <div className={styles.footerSubscribeWrap}>
            <p className={styles.linksTitle}>Subscribe Us</p>

            <p className={styles.infoDesc}>
              Signup for our newsletter to get the latest news in your inbox.
            </p>

            <InputSubscribe />
          </div>
        </div>

        <p className="line-separator" />

        <div className="container ta-c">
          <p className={styles.footerPlaceInfo}>©{this.currentYear} Marketplace | Terms | Privacy | Licenses | Imprint | Cookie Policy - Preferences | {this._version}</p>
        </div>
      </footer>
    )
  }
}

export default withComponent(Footer);
