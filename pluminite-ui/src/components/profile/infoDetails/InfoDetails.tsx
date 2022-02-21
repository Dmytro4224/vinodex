import React, {Component} from "react";
import {buttonColors, ButtonView} from "../../common/button/ButtonView";
import styles from './infoDetails.module.css';
import userIcon from '../../../assets/icons/user-gold.svg';
import emailIcon from '../../../assets/icons/mail-gold.svg';
import listIcon from '../../../assets/icons/list-gold.svg';
import arrowIcon from '../../../assets/icons/arrow-right.svg';
import { Form, FormCheck } from "react-bootstrap";

class InfoDetails extends Component {
  private readonly _radioNFTApproveRef:  React.RefObject<HTMLInputElement>;

  constructor(props) {
    super(props);

    this._radioNFTApproveRef = React.createRef();
  }

  render() {
    return (
      <div className={styles.profileDetailsWrap}>
        <div className="d-flex align-items-center justify-content-between my-3">
          <h3 className={styles.profileBlockTitle}>Profile details</h3>
          <ButtonView
            text={'EDIT'}
            onClick={() => {  }}
            color={buttonColors.gold}
          />
        </div>
        <ul className={styles.ulInfoList}>
          <li>
            <div className={`d-flex align-items-center w-100 cursor-pointer ${styles.itemWrap}`}>
              <img className={styles.iconStyle} width="20" height="20" src={userIcon} alt="icon"/>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>
                  <p className={styles.itemTitle}>User Name</p>
                  <p className={styles.itemSubTitle}>User Name Example</p>
                </div>
                <img src={arrowIcon} alt="arrow"/>
              </div>
            </div>
          </li>
          <li>
            <div className={`d-flex align-items-center w-100 cursor-pointer ${styles.itemWrap}`}>
              <img className={styles.iconStyle} width="20" height="20" src={emailIcon} alt="icon"/>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>
                  <p className={styles.itemTitle}>Email</p>
                  <p className={styles.itemSubTitle}>Email Example</p>
                </div>
                <img src={arrowIcon} alt="arrow"/>
              </div>
            </div>
          </li>
          <li>
            <div className={`d-flex align-items-center w-100 cursor-pointer ${styles.itemWrap}`}>
              <img className={styles.iconStyle} width="20" height="20" src={listIcon} alt="icon"/>
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>
                  <p className={styles.itemTitle}>Bio</p>
                  <p className={styles.itemSubTitle}>Bio Example</p>
                </div>
                <img src={arrowIcon} alt="arrow"/>
              </div>
            </div>
          </li>
        </ul>

        <div className="d-flex align-items-center justify-content-between my-3">
          <h3 className={styles.profileBlockTitle}>Settings</h3>
        </div>

        <ul className={styles.ulSettingsList}>
          <li>
            <Form>
              <FormCheck.Label htmlFor="switch-nft-approve">
                <div className={`d-flex align-items-center w-100 cursor-pointer justify-content-between ${styles.itemWrap}`}>
                  <div>
                    <p className={styles.itemTitle}>Approve NFT on Marketplace</p>
                    <p className={styles.itemSubTitle}>Description</p>
                  </div>

                   <Form.Check
                     type="switch"
                     id="switch-nft-approve"
                     label=""
                     ref={this._radioNFTApproveRef}
                   />
                </div>
              </FormCheck.Label>
            </Form>
          </li>
        </ul>
      </div>
    );
  }
}

export { InfoDetails };