import React, {Component} from "react";
import ButtonView, {buttonColors} from "../../common/button/ButtonView";
import styles from './infoDetails.module.css';
import userIcon from '../../../assets/icons/user-gold.svg';
import emailIcon from '../../../assets/icons/mail-gold.svg';
import listIcon from '../../../assets/icons/list-gold.svg';
import arrowIcon from '../../../assets/icons/arrow-right.svg';
import { Form, FormCheck } from "react-bootstrap";
import InputView, {ViewType} from "../../common/inputView/InputView";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";

interface IInfoDetails extends IProps {
  userId: string;
  isMyProfile: boolean;
}

class InfoDetails extends Component<IInfoDetails & IBaseComponentProps> {
  public state = {
    isEditForm: false,
  };

  private readonly _radioNFTApproveRef: any;
  private _refInputUserName: any;
  private _refInputUserEmail: any;
  private _refInputUserBio: any;

  constructor(props: IInfoDetails & IBaseComponentProps) {
    super(props);

    this._radioNFTApproveRef = null;
    this._refInputUserName = null;
    this._refInputUserEmail = null;
    this._refInputUserBio = null;
  }

  private changeToFormTemplate() {
    this.setState({
      ...this.state,
      isEditForm: true
    })
  }

  private changeToInfoTemplate() {
    this.setState({
      ...this.state,
      isEditForm: false
    })
  }

  private get getUserId() {
    return this.props.userId;
  }

  private get isMyProfile() {
    return this.props.isMyProfile;
  }

  private formSubmitHandler = async () => {
    const result = {
      name: this._refInputUserName.value,
      email: this._refInputUserEmail.value,
      bio: this._refInputUserBio.value,
    };

    console.table(result);
    this.changeToInfoTemplate();

    return

    this.props.nftContractContext.set_profile(result.bio, result.name, '', result.email, this.getUserId).then(profile => {
      // this.userProfile = profile;
      console.log('setProfile', profile);
    });
  }

  private infoTemplate() {
    return (
      <div className={styles.profileDetailsWrap}>
        <div className="d-flex align-items-center justify-content-between my-3">
          <h3 className={styles.profileBlockTitle}>Profile details</h3>
          {this.isMyProfile && <ButtonView
              text={'EDIT'}
              onClick={() => { this.changeToFormTemplate() }}
              color={buttonColors.gold}
          />}
        </div>
        <ul className={styles.ulInfoList}>
          <li>
            <div className={`d-flex align-items-center w-100 ${styles.itemWrap}`}>
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
            <div className={`d-flex align-items-center w-100 ${styles.itemWrap}`}>
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
            <div className={`d-flex align-items-center w-100 ${styles.itemWrap}`}>
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
                    disabled={!this.isMyProfile}
                  />
                </div>
              </FormCheck.Label>
            </Form>
          </li>
        </ul>
      </div>
    )
  }

  private formTemplate() {
    return (
      <div className={styles.profileDetailsWrap}>
        <div className="d-flex align-items-center justify-content-between my-3">
          <h3 className={styles.profileBlockTitle}>Edit profile</h3>
        </div>

        <div className={styles.form}>
          <InputView
            placeholder={'User name'}
            icon={userIcon}
            customClass={'mb-4'}
            setRef={(ref) => {this._refInputUserName = ref;}}
          />

          <InputView
            placeholder={'Email'}
            icon={emailIcon}
            customClass={'mb-4'}
            setRef={(ref) => {this._refInputUserEmail = ref;}}
          />

          <InputView
            placeholder={'Bio'}
            customClass={'mb-4'}
            viewType={ViewType.textarea}
            setRef={(ref) => {this._refInputUserBio = ref;}}
          />

          <div className="d-flex align-items-center justify-content-center">
            <ButtonView
              text={'CANCEL'}
              onClick={() => { this.changeToInfoTemplate() }}
              color={buttonColors.gold}
            />
            <ButtonView
              text={'SAVE'}
              onClick={this.formSubmitHandler}
              color={buttonColors.goldFill}
            />
          </div>
        </div>
      </div>
    )
  }

  render() {
    if (this.state.isEditForm) {
      return this.formTemplate();
    }

    return this.infoTemplate();
  }
}

export default withComponent(InfoDetails);