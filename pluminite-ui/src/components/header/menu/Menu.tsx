import { Component } from "react";
import styles from './menu.module.css';
import closeIcon from '../../../assets/icons/close.svg'
import defaultAvatar from '../../../assets/images/avatar-def.png';
import userIcon from '../../../assets/icons/user-gold.svg';
import createdIcon from '../../../assets/icons/create-icon.svg';
import purchasesIcon from '../../../assets/icons/purchases-icon.svg';
import activeBidsIcon from '../../../assets/icons/active-bids-icon.svg';
import favoritesIcon from '../../../assets/icons/heart-icon.svg';
import followingsIcon from '../../../assets/icons/followings-icon.svg';
import { dropdownColors, DropdownView } from "../../common/dropdown/dropdownView";
import { HeaderNavigation } from "../../navigation/HeaderNavigation";
import { ICurrentUser } from "../../../types/ICurrentUser";
import { IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import { NavLink } from "react-router-dom";
import ButtonView, { buttonColors } from "../../common/button/ButtonView";
import ButtonCopy from "../../common/buttonCopy/ButtonCopy";

interface IMenu extends IProps {
  user: ICurrentUser | null;
}

class Menu extends Component<IMenu & IBaseComponentProps> {
  state = {
    isOpen: false
  }

  constructor(props: IMenu & IBaseComponentProps) {
    super(props);
  }

  private toggleMenu() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  get accountId() {
    return this.props.user?.accountId;
  }

  get avatar() {
    return this.props.user?.image || defaultAvatar;
  }

  get name() {
    return this.props.user?.name;
  }

  render() {
    return (
      <>
        <input
          checked={this.state.isOpen}
          className={styles.inputMenu}
          onChange={() => this.toggleMenu()}
          hidden
          type="checkbox"
          id="menuBtn"
        />
        <label htmlFor="menuBtn" className={styles.label}>
          <div></div>
          <div></div>
          <div></div>
        </label>

        <div onClick={() => this.toggleMenu()} className={`${styles.menuWrap} ${this.state.isOpen && styles.open}`} />
        <div className={`${styles.menu} ${this.state.isOpen && styles.open}`}>
          <div className="d-flex align-items-center justify-content-between p-3">
            <button className={styles.btnClose} onClick={() => this.toggleMenu()}><img src={closeIcon} alt="close" /></button>
            <DropdownView
              colorType={dropdownColors.selectGray}
              title={'En'}
              disabled={true}
              onChange={(item) => { console.log(item) }}
              childrens={[]}
            />
          </div>

          <div onClick={() => this.toggleMenu()} className={`p-3 ${styles.navWrap}`}>
            <HeaderNavigation />
          </div>

          <p className="line-separator" />

          <div className="w-100 p-3">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center mt-2">
                <img className={styles.avatar} width="40" height="40" src={this.avatar} alt="avatar" />
                <div>
                  <p className={styles.name}>{this.name}</p>
                  <p className={styles.accountId}>{this.accountId || ''}</p>
                </div>
              </div>
              <ButtonCopy copyText={this.accountId || ''} />
            </div>

            <ul onClick={() => this.toggleMenu()} className={styles.otherNavigation}>
              <li>
                <NavLink to={`/userProfile/${this.accountId}?tab=details`}>
                  <img width="24" height="24" src={userIcon} alt="icon" />
                  <p>Profile Details</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/userProfile/${this.accountId}?tab=items`}>
                  <img width="24" height="24" src={createdIcon} alt="icon" />
                  <p>Created Items</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/userProfile/${this.accountId}?tab=purchases`}>
                  <img width="24" height="24" src={purchasesIcon} alt="icon" />
                  <p>Purchases</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/userProfile/${this.accountId}?tab=birds`}>
                  <img width="24" height="24" src={activeBidsIcon} alt="icon" />
                  <p>Active Bids</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/userProfile/${this.accountId}?tab=following`}>
                  <img width="24" height="24" src={followingsIcon} alt="icon" />
                  <p>Followings</p>
                </NavLink>
              </li>
              <li>
                <NavLink to={`/userProfile/${this.accountId}?tab=favorites`}>
                  <img width="24" height="24" src={favoritesIcon} alt="icon" />
                  <p>Favorites</p>
                </NavLink>
              </li>
            </ul>

            <p className="line-separator" />

            <ButtonView
              text={'Disconnect'}
              onClick={() => { this.props.near.signOut(); this.toggleMenu(); }}
              color={buttonColors.select}
              customClass={styles.buttonDisconnect}
            />
          </div>

        </div>
      </>
    )
  }
}

export default withComponent(Menu);