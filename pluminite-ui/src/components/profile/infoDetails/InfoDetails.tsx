import React, { Component } from "react";
import ButtonView, { buttonColors } from "../../common/button/ButtonView";
import styles from './infoDetails.module.css';
import userIcon from '../../../assets/icons/user-gold.svg';
import emailIcon from '../../../assets/icons/mail-gold.svg';
import listIcon from '../../../assets/icons/list-gold.svg';
import arrowIcon from '../../../assets/icons/arrow-right.svg';
import { Form, FormCheck } from "react-bootstrap";
import InputView, { InputType, ViewType } from "../../common/inputView/InputView";
import { IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import { isEqual, isValidEmail, showToast } from "../../../utils/sys";
import { EShowTost } from "../../../types/ISysTypes";

interface IInfoDetails extends IProps {
  updateUserInfo: (profile) => Promise<any>;
  updateStateUserInfo: (profile) => void;
  isMyProfile: boolean;
  userId: string;
  profile: {
    name: string,
    email: string,
    bio: string,
  };
}

class InfoDetails extends Component<IInfoDetails & IBaseComponentProps> {
  public state = {
    isEditForm: false,
    isLoading: false,
    validate: {
      formValid: true,
      isNameValid: true,
      isEmailValid: true,
      isBioValid: true,
    },
    profile: {
      name: this.profile.name,
      email: this.profile.email,
      bio: this.profile.bio,
    }
  };

  private _radioNFTApproveRef: any;
  private _refInputUserName: any;
  private _refInputUserEmail: any;
  private _refInputUserBio: any;

  constructor(props: IInfoDetails & IBaseComponentProps) {
    super(props);
  }

  public componentDidUpdate(prevState, currentState) {
    if (!isEqual(prevState.profile, currentState.profile) && this.state.validate.formValid && !this.state.isLoading) {
      this.setProfileInfo({
        name: prevState.profile.name,
        email: prevState.profile.email,
        bio: prevState.profile.bio,
      });
    }
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

  private get profile() {
    return this.props.profile;
  }

  private updateUserInfo(profile: { name: string, email: string, bio: string, image: string, accountId: string }) {
    return this.props.updateUserInfo && this.props.updateUserInfo(profile);
  }

  private isValidForm() {
    let validInfo = {
      name: true,
      email: true,
      bio: true
    };

    // if (this._refInputUserName.value.trim() === '') {
    //   validInfo.name = false;
    // }

    if (this._refInputUserEmail.value.trim() !== '' && !isValidEmail(this._refInputUserEmail.value.trim())) {
      validInfo.email = false;
    }

    // if (this._refInputUserBio.value.trim() === '') {
    //   validInfo.bio = false;
    // }

    if (!validInfo.name || !validInfo.email || !validInfo.bio) {
      this.setState({
        ...this.state,
        profile: {
          name: this._refInputUserName.value,
          email: this._refInputUserEmail.value,
          bio: this._refInputUserBio.value,
        },
        validate: {
          formValid: false,
          isNameValid: validInfo.name,
          isEmailValid: validInfo.email,
          isBioValid: validInfo.bio,
        }
      })

      return false;
    }

    return true;
  }

  private formSubmitHandler = async () => {
    if (!this.isValidForm()) return;

    const result = {
      profile: {
        name: this._refInputUserName.value,
        email: this._refInputUserEmail.value,
        bio: this._refInputUserBio.value,
        accountId: this.getUserId,
        image: ''
      }
    };

    this.setState({
      ...this.state,
      profile: {
        name: result.profile.name,
        email: result.profile.email,
        bio: result.profile.bio,
      },
      validate: {
        formValid: true,
        isNameValid: true,
        isEmailValid: true,
        isBioValid: true,
      },
      isLoading: true
    })

    this.updateUserInfo({
      name: result.profile.name,
      email: result.profile.email,
      bio: result.profile.bio,
      accountId: result.profile.accountId,
      image: ''
    }).then(res => {
      showToast({
        message: `Data saved successfully.`,
        type: EShowTost.success
      });

      this.setState({
        ...this.state,
        isLoading: false
      })

      this.changeToInfoTemplate();

      this.props.updateStateUserInfo && this.props.updateStateUserInfo({
        name: result.profile.name,
        email: result.profile.email,
        bio: result.profile.bio,
        image: '',
      });
    }).catch(error => {
      this.setState({
        ...this.state,
        isLoading: false
      })

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error
      });
    })
  }

  private setProfileInfo({ name, email, bio }) {
    this.setState({
      ...this.state,
      profile: {
        name: name,
        email: email,
        bio: bio,
      }
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
        <ul style={{ cursor: 'pointer' }} onClick={() => { this.isMyProfile && this.changeToFormTemplate() }} className={styles.ulInfoList}>
          <li>
            <div className={`d-flex align-items-center w-100 ${styles.itemWrap}`}>
              <img className={styles.iconStyle} width="20" height="20" src={userIcon} alt="icon" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>
                  <p className={styles.itemTitle}>User Name</p>
                  <p className={styles.itemSubTitle}>{this.profile.name}</p>
                </div>
                <img src={arrowIcon} alt="arrow" />
              </div>
            </div>
          </li>
          <li>
            <div className={`d-flex align-items-center w-100 ${styles.itemWrap}`}>
              <img className={styles.iconStyle} width="20" height="20" src={emailIcon} alt="icon" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>
                  <p className={styles.itemTitle}>Email</p>
                  <p className={styles.itemSubTitle}>{this.profile.email}</p>
                </div>
                <img src={arrowIcon} alt="arrow" />
              </div>
            </div>
          </li>
          <li>
            <div className={`d-flex align-items-center w-100 ${styles.itemWrap}`}>
              <img className={styles.iconStyle} width="20" height="20" src={listIcon} alt="icon" />
              <div className="d-flex align-items-center justify-content-between w-100">
                <div>
                  <p className={styles.itemTitle}>Bio</p>
                  <p className={styles.itemSubTitle}>{this.profile.bio}</p>
                </div>
                <img src={arrowIcon} alt="arrow" />
              </div>
            </div>
          </li>
        </ul>

        {/*<div className="d-flex align-items-center justify-content-between my-3">*/}
        {/*  <h3 className={styles.profileBlockTitle}>Settings</h3>*/}
        {/*</div>*/}

        {/*<ul className={styles.ulSettingsList}>*/}
        {/*  <li>*/}
        {/*    <Form>*/}
        {/*      <FormCheck.Label htmlFor="switch-nft-approve">*/}
        {/*        <div className={`d-flex align-items-center w-100 cursor-pointer justify-content-between ${styles.itemWrap}`}>*/}
        {/*          <div>*/}
        {/*            <p className={styles.itemTitle}>Approve NFT on Marketplace</p>*/}
        {/*            <p className={styles.itemSubTitle}>Description</p>*/}
        {/*          </div>*/}

        {/*          <Form.Check*/}
        {/*            type="switch"*/}
        {/*            id="switch-nft-approve"*/}
        {/*            label=""*/}
        {/*            ref={this._radioNFTApproveRef}*/}
        {/*            disabled={!this.isMyProfile}*/}
        {/*          />*/}
        {/*        </div>*/}
        {/*      </FormCheck.Label>*/}
        {/*    </Form>*/}
        {/*  </li>*/}
        {/*</ul>*/}
      </div>
    )
  }

  private formTemplate() {
    return (
      <form onSubmit={(e) => { e.preventDefault() }} className={styles.profileDetailsWrap}>
        <div className="d-flex align-items-center justify-content-between my-3">
          <h3 className={styles.profileBlockTitle}>Edit profile</h3>
        </div>

        <div className={styles.form}>
          <InputView
            placeholder={'User name'}
            icon={userIcon}
            customClass={'mb-4'}
            value={this.state.profile.name}
            absPlaceholder={'User name'}
            setRef={(ref) => { this._refInputUserName = ref; }}
            disabled={this.state.isLoading}
            isError={!this.state.validate.isNameValid}
            errorMessage={`Enter the Name`}
          />

          <InputView
            placeholder={'Email'}
            icon={emailIcon}
            customClass={'mb-4'}
            inputType={InputType.email}
            value={this.state.profile.email}
            absPlaceholder={'Email'}
            setRef={(ref) => { this._refInputUserEmail = ref; }}
            disabled={this.state.isLoading}
            isError={!this.state.validate.isEmailValid}
            errorMessage={`Enter mail in the correct format.`}
          />

          <InputView
            placeholder={'Bio'}
            customClass={'mb-4'}
            viewType={ViewType.textarea}
            value={this.state.profile.bio}
            absPlaceholder={'Bio'}
            setRef={(ref) => { this._refInputUserBio = ref; }}
            disabled={this.state.isLoading}
            isError={!this.state.validate.isBioValid}
            errorMessage={`Enter the Bio`}
          />

          <div className="d-flex align-items-center justify-content-center">
            <ButtonView
              text={'CANCEL'}
              onClick={() => { this.changeToInfoTemplate() }}
              color={buttonColors.select}
              customClass={`${styles.btnCancel}`}
            />
            <ButtonView
              text={'SAVE'}
              onClick={this.formSubmitHandler}
              color={buttonColors.goldFill}
              isLoading={this.state.isLoading}
              customClass={`${styles.btnSave}`}
            />
          </div>
        </div>
      </form>
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
