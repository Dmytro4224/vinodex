import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { ICurrentUser } from "../../../types/ICurrentUser";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import styles from '../../common/dropdown/dropdownView.module.css';
import styled from './userDropdown.module.css';
import defaultAvatar from '../../../assets/images/avatar-def.png';
import { transformArtistId } from "../../../utils/sys";
import ButtonView, { buttonColors } from "../../common/button/ButtonView";
import avatarDefault from "../../../assets/images/default-avatar-big.png";
import userIcon from '../../../assets/icons/user-gold.svg';
import {IdentificationCopy} from "../../common/identificationCopy/IdentificationCopy";
import {NavLink} from "react-router-dom";

interface IUserDropdown extends IProps{
  user: ICurrentUser
}

class UserDropdown extends Component<IUserDropdown & IBaseComponentProps>{
  constructor(props: IUserDropdown & IBaseComponentProps) {
    super(props);
  }

  render(){
    console.log('this.props.user.accountId',this.props.user)
    return <><Dropdown className={`${styles.customDropdown} ${styles.userDropdown}`}>
      <Dropdown.Toggle variant="" id="dropdown-basic" className={`${styles.dropdownButton} ${styles.dropdownSelect} ${styles.userDropdownButton}`}>
        <img className={styles.userAvatar} src={defaultAvatar} alt="avatar"/>
        {transformArtistId(this.props.user.accountId)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
       {/* <Dropdown.Item>

        </Dropdown.Item>*/}
        <div className="w-100 d-flex align-items-center justify-content-center flex-column p-2">
          <div className="d-flex align-items-center justify-content-center flex-column">
            <img className={styles.avatar} width="72" height="72" src={avatarDefault} alt="avatar" />
            <p className={styles.profileName}>{this.props.user.accountId}</p>
            <IdentificationCopy idCustomClass={styles.idTextStyle} id={this.props.user.accountId} />
          </div>

          <p className={styles.line} />

          <ul className={styles.navList}>
            <li>
              <NavLink to={`/userProfile/${this.props.user.accountId}`}><img src={userIcon} alt=""/> <p>Profile Details</p></NavLink>
            </li>
          </ul>

          <p className={styles.line} />

          <ButtonView
            text={'Disconect'}
            onClick={() => {
              this.props.near.signOut();
            }}
            color={buttonColors.select}
            customClass={styled.button}
          />
        </div>
      </Dropdown.Menu>
    </Dropdown></>
  }
}

export default withComponent(UserDropdown);
