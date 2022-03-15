import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import styles from './footer.module.css';
import footerLogo from '../../assets/icons/footer-logo.svg';
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

  render() {
    return (
      <footer className={styles.footer}>
        <div className={`container ${styles.contentBox}`}>
          <div className={styles.footerInfoWrap}>
            <img className={styles.footerLogo} width="145" height="45" src={footerLogo} alt="logo" />

            <p className={styles.infoDesc}>
              Lorem ipsum dolor sit amet,consectetur
              adip isicing elit. Quis non, fugit totam vel
              laboriosam vitae.
            </p>

            <Social />
          </div>

          <div className={styles.footerLinksWrap}>
            <div className={styles.myAccountLinks}>
              <p className={styles.linksTitle}>My Account</p>
              <ul className={styles.linksWrap}>
                <li>
                  <NavLink to={`/userProfile/${this.accountId}?tab=details`}>Profile</NavLink>
                </li>
                <li>
                  {/* <NavLink to={`/userProfile/${this.accountId}?tab=purchases`}>My Auctions</NavLink>Active Bids */}
                  <NavLink to={`/userProfile/${this.accountId}?tab=birds`}>My Active Bids</NavLink>
                </li>
                <li>
                  <NavLink to={`/userProfile/${this.accountId}?tab=items`}>My Wine</NavLink>
                </li>
                <li>
                  <NavLink to={`/userProfile/${this.accountId}?tab=following`}>Activity</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.linksTitle}>Resources</p>
              <ul className={styles.linksWrap}>
                <li>
                  <NavLink to={'/'}>Help & Support</NavLink>
                </li>
                <li>
                  <NavLink to={'/'}>Live Auctions</NavLink>
                </li>
                <li>
                  <NavLink to={'/'}>Wine Details</NavLink>
                </li>
                <li>
                  <NavLink to={'/'}>Activity</NavLink>
                </li>
              </ul>
            </div>
            <div>
              <p className={styles.linksTitle}>Company</p>
              <ul className={styles.linksWrap}>
                <li>
                  <NavLink to={'/'}>About Us</NavLink>
                </li>
                <li>
                  <NavLink to={'/'}>Contact Us</NavLink>
                </li>
                <li>
                  <NavLink to={'/'}>Our Blog</NavLink>
                </li>
                <li>
                  <NavLink to={'/'}>Discover</NavLink>
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