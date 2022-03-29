import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { ICurrentUser } from "../../../types/ICurrentUser";
import { IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import styles from '../../common/dropdown/dropdownView.module.css';
import styled from './userDropdown.module.css';
import { changeAvatarRefSrc, transformArtistId } from "../../../utils/sys";
import ButtonView, { buttonColors } from "../../common/button/ButtonView";
import defaultAvatar from '../../../assets/images/avatar-def.png';
import userIcon from '../../../assets/icons/user-gold.svg';
import createdIcon from '../../../assets/icons/create-icon.svg';
import purchasesIcon from '../../../assets/icons/purchases-icon.svg';
import activeBidsIcon from '../../../assets/icons/active-bids-icon.svg';
import favoritesIcon from '../../../assets/icons/heart-icon.svg';
import followingsIcon from '../../../assets/icons/followings-icon.svg';
import collectionIcon from '../../../assets/icons/collect-icon.svg';
import { IdentificationCopy } from "../../common/identificationCopy/IdentificationCopy";
import { NavLink } from "react-router-dom";

interface IUserDropdown extends IProps {
  user: ICurrentUser
}

class UserDropdown extends Component<IUserDropdown & IBaseComponentProps>{
  private _refAvatar: any;
  private _refAvatarSm: any;

  constructor(props: IUserDropdown & IBaseComponentProps) {
    super(props);

    this._refAvatar = React.createRef();
    this._refAvatarSm = React.createRef();
  }

  get accountId() {
    return this.props.user.accountId;
  }

  get avatar() {
    return this.props.user.image || defaultAvatar;
  }

  get name() {
    return this.props.user.name;
  }

  render() {
    return <>
      <Dropdown className={`${styles.customDropdown} ${styles.userDropdown}`}>
        <Dropdown.Toggle variant="" id="dropdown-basic" className={`${styles.dropdownButton} ${styles.dropdownSelect} ${styles.userDropdownButton}`}>
          <img ref={this._refAvatarSm} onError={() => { changeAvatarRefSrc(this._refAvatarSm) }} className={styles.userAvatar} src={this.avatar} alt="" />
          {transformArtistId(this.accountId)}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* <Dropdown.Item>

        </Dropdown.Item>*/}
          <div className="w-100 d-flex align-items-center justify-content-center flex-column p-2">
            <div className="d-flex align-items-center justify-content-center flex-column">
              <img ref={this._refAvatar} onError={() => { changeAvatarRefSrc(this._refAvatar) }} className={styles.avatar} width="72" height="72" src={this.avatar} alt="avatar" />
              <p className={styles.profileName}>{this.name}</p>
              <IdentificationCopy idCustomClass={styles.idTextStyle} id={this.accountId} />
            </div>

            <p className={styles.line} />

            <ul className={styles.navList}>
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
                <NavLink to={`/userProfile/${this.accountId}?tab=collections`}>
                  <img width="24" height="24" src={collectionIcon} alt="icon" />
                  <p>My Collections</p>
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

            <p className={styles.line} />

            <ButtonView
              text={'Disconnect'}
              onClick={() => { this.props.near.signOut(); }}
              color={buttonColors.select}
              customClass={styled.button}
            />
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </>
  }
}

export default withComponent(UserDropdown);
