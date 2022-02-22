import { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { ICurrentUser } from "../../../types/ICurrentUser";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import { dropdownColors, DropdownView } from "../../common/dropdown/dropdownView";
import styles from '../../common/dropdown/dropdownView.module.css';
import styled from './userDropdown.module.css';
import defaultAvatar from '../../../assets/images/avatar-def.png';
import { transformArtistId } from "../../../utils/sys";
import ButtonView, { buttonColors } from "../../common/button/ButtonView";

interface IUserDropdown extends IProps{
  user: ICurrentUser
}

class UserDropdown extends Component<IUserDropdown & IBaseComponentProps>{
  constructor(props: IUserDropdown & IBaseComponentProps) {
    super(props);
  }

  render(){
    return <><Dropdown className={`${styles.customDropdown} ${styles.userDropdown}`}>
      <Dropdown.Toggle variant="" id="dropdown-basic" className={`${styles.dropdownButton} ${styles.dropdownSelect} ${styles.userDropdownButton}`}>
        <img className={styles.userAvatar} src={defaultAvatar} alt="avatar"/>
        {transformArtistId(this.props.user.accountId)}
      </Dropdown.Toggle>

      <Dropdown.Menu>
       {/* <Dropdown.Item>

        </Dropdown.Item>*/}
        <div className="w-100 d-flex align-items-center justify-content-center p-2">
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