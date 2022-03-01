import React, { ChangeEvent, ChangeEventHandler, Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { Spinner, Tab, Tabs } from "react-bootstrap";
import InfoDetails from "../../components/profile/infoDetails/InfoDetails";
import { EmptyListView } from "../../components/common/emptyList/emptyListView";
import { InfoCounters } from "../../components/profile/infoCounters/InfoCounters";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import { IUploadFileResponse, pinataAPI } from "../../api/Pinata";
import avatarUpload from '../../assets/icons/upload_avatar.svg';
import { showToast } from "../../utils/sys";
import { EShowTost } from "../../types/ISysTypes";

interface IUserProfile extends IProps { }

interface IUpdateStateUserInfo {
  name: string;
  email: string;
  bio: string;
  image?: string;
}

interface IUpdateUser {
  name: string;
  email: string;
  bio: string;
  accountId: string;
  image: string;
}

class UserProfile extends Component<IUserProfile & IBaseComponentProps> {
  public state = {
    isLoadAvatar: false,
    image: avatarDefault,
    profile: {
      bio: 'Bio Example',
      email: 'User Name Example',
      name: 'User Name Example',
    }
  }

  private _selectFile?: File;
  private _fileResponse: IUploadFileResponse | undefined
  private _imageRef: React.RefObject<HTMLImageElement>;
  private _inputFile: React.RefObject<HTMLInputElement>;

  constructor(props: IUserProfile & IBaseComponentProps) {
    super(props);

    this._imageRef = React.createRef<HTMLImageElement>();
    this._inputFile = React.createRef<HTMLInputElement>();
  }

  private get getUserId() {
    return this.props.params.userId!;
  }

  private get isMyProfile() {
    return this.props.near.user?.accountId === this.getUserId;
  }

  public setSelectFile = async (e) => {
    this._selectFile = e.currentTarget.files[0];

    if (!this._selectFile) {
      return console.warn('selectFile is not defined');
    }

    this.setState({
      ...this.state,
      isLoadAvatar: true
    })

    this._fileResponse = await pinataAPI.uploadFile(this._selectFile as File);

    if (this._fileResponse && this._imageRef?.current) {
      const src = pinataAPI.createUrl(this._fileResponse.IpfsHash!);

      this.updateUser({
        name: this.state.profile.name,
        email: this.state.profile.email,
        bio: this.state.profile.bio,
        image: src,
        accountId: this.getUserId
      });
    } else {
      this.setState({
        ...this.state,
        isLoadAvatar: false
      })
    }
  }

  public componentDidMount() {
    if (!this.isMyProfile) {
      this.props.nftContractContext.view_artist_account(this.getUserId)
        .then(res => {
          console.log("🚀 ~ file: UserProfile.tsx ~ line 38 ~ UserProfile ~ view_artist_account ~ success", res)
        })
        .catch(error => {
          console.warn("🚀 ~ file: UserProfile.tsx ~ line 41 ~ UserProfile ~ view_artist_account ~ error", error)
        })
    }

    this.props.nftContractContext.getProfile(this.getUserId).then(profile => {
      console.log("🚀 ~ file: UserProfile.tsx ~ line 38 ~ UserProfile ~ this.props.nftContractContext.getProfile ~ profile", profile)

      if (profile) {
        this.userProfile = profile;
      }
    });
  }

  private set userProfile(profile) {
    this.setState({
      ...this.state,
      image: profile.image || avatarDefault,
      profile: {
        bio: profile.bio,
        email: profile.email,
        name: profile.name
      }
    })
  }

  private callUpdateUser({ name, email, bio, accountId, image }: IUpdateUser) {
    return this.props.nftContractContext.set_profile({
      profile: { name, email, bio, accountId, image }
    })
  }

  private updateUser = async (info: IUpdateUser) => {
    this.callUpdateUser(info)
      .then(res => {
        showToast({
          message: `Data saved successfully.`,
          type: EShowTost.success
        });

        this.updateStateUserInfo(info);
      }).catch(error => {
        showToast({
          message: `Error! Please try again later.`,
          type: EShowTost.error
        });

        this.setState({
          ...this.state,
          isLoadAvatar: false
        })
      })
  }

  public updateStateUserInfo(profile: IUpdateStateUserInfo) {
    this.setState({
      ...this.state,
      ...(profile.image && { image: profile.image }),
      isLoadAvatar: false,
      profile: {
        bio: profile.bio,
        email: profile.email,
        name: profile.name
      }
    })
  }

  private getProfileTabs() {
    if (this.isMyProfile) {
      return (
        <Tabs
          id="controlled-tab-example"
          className="mb-3 justify-content-center"
        >
          <Tab eventKey="details" title="Profile details">
            <InfoDetails
              isMyProfile={this.isMyProfile}
              userId={this.getUserId}
              profile={this.state.profile}
              updateUserInfo={(profile) => this.callUpdateUser(profile)}
              updateStateUserInfo={(profile) => { this.updateStateUserInfo(profile) }}
            />
          </Tab>
          <Tab eventKey="sale" title="On sale">
            <div style={{ minHeight: '300px' }}><EmptyListView /></div>
          </Tab>
          <Tab eventKey="items" title="Created Items">
            <div style={{ minHeight: '300px' }}><EmptyListView /></div>
          </Tab>
          <Tab eventKey="purchases" title="Purchases">
            <div style={{ minHeight: '300px' }}><EmptyListView /></div>
          </Tab>
          <Tab eventKey="birds" title="Active Bids">
            <div style={{ minHeight: '300px' }}><EmptyListView /></div>
          </Tab>
          <Tab eventKey="following" title="Following">
            <div style={{ minHeight: '300px' }}><EmptyListView /></div>
          </Tab>
          <Tab eventKey="favourites" title="Favourites">
            <div style={{ minHeight: '300px' }}><EmptyListView /></div>
          </Tab>
        </Tabs>
      )
    }

    return (
      <Tabs
        id="controlled-tab-example"
        className="mb-3 justify-content-center"
      >
        <Tab eventKey="sale" title="On sale">
          <div style={{ minHeight: '300px' }}><EmptyListView /></div>
        </Tab>
        <Tab eventKey="items" title="Created Items">
          <div style={{ minHeight: '300px' }}><EmptyListView /></div>
        </Tab>
        <Tab eventKey="owned" title="Owned">
          <div style={{ minHeight: '300px' }}><EmptyListView /></div>
        </Tab>
        <Tab eventKey="favourites" title="Favourites">
          <div style={{ minHeight: '300px' }}><EmptyListView /></div>
        </Tab>
      </Tabs>
    )
  }

  public render() {
    return (
      <>
        <div className={`position-relative ${styles.profileWrap}`}>
          <div className="container">
            <div className={styles.bgWrap}>
              <div className={styles.bgBlock} />
            </div>

            <div className={styles.profileInfoWrap}>
              <div className={styles.avatarWrap}>
                <img ref={this._imageRef} width="100" height="100" src={this.state.image} alt="avatar" />
                {this.isMyProfile && (
                  <div className={styles.uploadAvatarWrap}>
                    <label>
                      <input ref={this._inputFile} onChange={this.setSelectFile} hidden type="file" />
                      <img alt="icon" src={avatarUpload} />
                    </label>
                  </div>
                )}
                {this.state.isLoadAvatar && <div className={styles.avatarSpinnerWrap}><Spinner animation="grow" variant="light" /></div>}
              </div>
              <p className={styles.profileName}>{this.state.profile.name}</p>
              <IdentificationCopy id={this.getUserId} />
            </div>

            {!this.isMyProfile ? (
              <>
                <div className={styles.bioWrap}>{this.state.profile.bio}</div>
                <ButtonView
                  text={"Follow"}
                  onClick={() => { }}
                  color={buttonColors.goldFill}
                  customClass={styles.buttonFollow}
                />
                <InfoCounters />
              </>
            ) : null}
          </div>
          <div className={styles.tabsWrap}>
            {this.getProfileTabs()}
          </div>
        </div>
      </>
    );
  }
}

export default withComponent(UserProfile);