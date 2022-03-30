import React, { Component } from 'react';
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import coverDff from '../../assets/images/user-profile-bg.jpg';
import avatarUpload from '../../assets/icons/upload_avatar.svg';
import { IdentificationCopy } from '../../components/common/identificationCopy/IdentificationCopy';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { Spinner, Tab, Tabs } from 'react-bootstrap';
import InfoDetails from '../../components/profile/infoDetails/InfoDetails';
import { InfoCounters } from '../../components/profile/infoCounters/InfoCounters';
import ButtonView, { buttonColors } from '../../components/common/button/ButtonView';
import { pinataAPI } from '../../api/Pinata';
import { IUploadFileResponse } from '../../api/IUploadFileResponse';
import { changeAvatarRefSrc, showToast } from '../../utils/sys';
import { EShowTost } from '../../types/ISysTypes';
import ProfileTokensView from '../../components/profile/profileTokensView/ProfileTokensView';
import { ProfileTokensType } from '../../types/ProfileTokenTypes';
import { BestArtistsParameter } from '../../types/BestArtistsParameter';
import ArtistsView, { ArtistViewType } from '../artists';
import { nftStorage } from '../../api/NftStorage';
import UserPurchases from '../../components/userPurchases/UserPurchases';
import Collections from '../../components/collections/Collections';

interface IUserProfile extends IProps {
  callUpdateUserInfo: () => void;
}

interface IUpdateStateUserInfo {
  name: string;
  email: string;
  bio: string;
  image?: string;
  cover_image?: string;
}

interface IUpdateUser {
  name: string;
  email: string;
  bio: string;
  accountId: string;
  image: string;
  cover_image: string;
}

class UserProfile extends Component<IUserProfile & IBaseComponentProps> {
  private _refAvatar: any;
  private _selectFile?: File;
  private _fileResponse: IUploadFileResponse | undefined;
  private _inputFile: React.RefObject<HTMLInputElement>;

  public state = {
    isLoadAvatar: false,
    image: avatarDefault,
    cover_image: coverDff,
    activeTab: this.activeTabFromUrl,
    catalog: 'Art',
    sort: 7,
    profile: {
      bio: 'Bio Example',
      email: 'User Name Example',
      name: 'User Name Example',
    },
  };

  constructor(props: IUserProfile & IBaseComponentProps) {
    super(props);

    this._inputFile = React.createRef<HTMLInputElement>();
    this._refAvatar = React.createRef();
  }

  public componentDidMount() {
    window.scrollTo(0, 0);

    // if (!this.isMyProfile) {
    //   this.props.nftContractContext.view_artist_account(this.getUserId)
    //     .then(res => {
    //
    //     })
    //     .catch(error => {
    //       console.warn('🚀 ~ file: view_artist_account ~ error', error);
    //     });
    // }

    this.getData();
  }

  public componentDidUpdate(prevState, currentState) {
    if (this.state.activeTab !== this.activeTabFromUrl && this.activeTabFromUrl) {
      this.setState({
        ...this.state,
        activeTab: this.activeTabFromUrl,
      });
    }

    if (prevState.params.userId !== this.props.params.userId) {
      this.getData();
    }
  }

  private getData() {
    this.props.nftContractContext.getProfile(this.getUserId).then(profile => {
      if (profile) {
        this.userProfile = profile;
      }
    });
  }

  public setSelectFile = async (e) => {
    this._selectFile = e.currentTarget.files[0];

    if (!this._selectFile) {
      return console.warn('selectFile is not defined');
    }

    this.setState({
      ...this.state,
      isLoadAvatar: true,
    });

    this._fileResponse = await nftStorage.uploadFile(this._selectFile as File, 'name', 'descr');

    if (this._fileResponse) {
      const src = this._fileResponse.url;// pinataAPI.createUrl(this._fileResponse.IpfsHash!);

      this.updateUser({
        name: this.state.profile.name,
        email: this.state.profile.email,
        bio: this.state.profile.bio,
        image: src,
        cover_image: '',
        accountId: this.getUserId,
      });
    } else {
      this.setState({
        ...this.state,
        isLoadAvatar: false,
      });
    }
  };

  private callUpdateUser({ name, email, bio, accountId, image, cover_image }: IUpdateUser) {
    const imgDef = (this.state.image?.length || 0) > 255 ? '' : this.state.image;

    return this.props.nftContractContext.set_profile({
      profile: { name, email, bio, accountId, image: image || imgDef, cover_image: cover_image },
    });
  }

  private updateUser = async (info: IUpdateUser) => {
    this.callUpdateUser(info)
      .then(res => {
        showToast({
          message: `Data saved successfully.`,
          type: EShowTost.success,
        });

        this.updateStateUserInfo(info);
      }).catch(error => {
        showToast({
          message: `Error! Please try again later.`,
          type: EShowTost.error,
        });

        this.setState({
          ...this.state,
          isLoadAvatar: false,
        });
      });
  };

  public updateStateUserInfo(profile: IUpdateStateUserInfo) {
    this.setState({
      ...this.state,
      ...(profile.image && { image: profile.image }),
      isLoadAvatar: false,
      profile: {
        bio: profile.bio,
        email: profile.email,
        name: profile.name,
      },
    });

    this.props.callUpdateUserInfo && this.props.callUpdateUserInfo();
  }

  private getProfileTabs() {
    if (this.isMyProfile) {
      return (
        <Tabs
          activeKey={this.state.activeTab || `details`}
          onSelect={(key) => this.updateActiveTab(key)}
          id='controlled-tab-example'
          className='justify-content-center'
        >
          <Tab eventKey='details' title='Profile details' style={{ background: 'var(--alabasterapprox)' }}>
            <InfoDetails
              isMyProfile={this.isMyProfile}
              userId={this.getUserId}
              profile={this.state.profile}
              updateUserInfo={(profile) => this.callUpdateUser(profile)}
              updateStateUserInfo={(profile) => {
                this.updateStateUserInfo(profile);
              }}
            />
          </Tab>
          <Tab eventKey='sale' title='On sale'>
            <ProfileTokensView
              catalog={this.catalog}
              sort={this.sort}
              typeViewTokens={ProfileTokensType.onSale}
            />
          </Tab>
          <Tab eventKey='collections' title='My collections'>
            <Collections />
          </Tab>
          <Tab eventKey='items' title='Created Items'>
            <ProfileTokensView
              catalog={this.catalog}
              sort={this.sort}
              typeViewTokens={ProfileTokensType.createdItems}
            />
          </Tab>
          <Tab eventKey='purchases' title='Purchases'>
            <UserPurchases />
          </Tab>
          <Tab eventKey='birds' title='Active Bids'>
            <ProfileTokensView
              catalog={this.catalog}
              sort={this.sort}
              typeViewTokens={ProfileTokensType.activeBids}
            />
          </Tab>
          <Tab eventKey='following' title='Following'>
            <div style={{ minHeight: '300px' }}>
              <ArtistsView viewType={ArtistViewType.profilePage} parameter={BestArtistsParameter.likes_count} />
            </div>
          </Tab>
          <Tab eventKey='favorites' title='Favorites'>
            <ProfileTokensView
              catalog={this.catalog}
              sort={this.sort}
              typeViewTokens={ProfileTokensType.favourites}
            />
          </Tab>
        </Tabs >
      );
    }

    return (
      <Tabs
        activeKey={this.state.activeTab || `sale`}
        onSelect={(key) => this.updateActiveTab(key)}
        id='controlled-tab-example'
        className='mb-3 justify-content-center'
      >
        <Tab eventKey='sale' title='On sale'>
          <ProfileTokensView
            catalog={this.catalog}
            sort={this.sort}
            typeViewTokens={ProfileTokensType.onSale}
          />
        </Tab>
        <Tab eventKey='collections' title='My collections'>
          <Collections />
        </Tab>
        <Tab eventKey='items' title='Created Items'>
          <ProfileTokensView
            catalog={this.catalog}
            sort={this.sort}
            typeViewTokens={ProfileTokensType.createdItems}
          />
        </Tab>
        {/* <Tab eventKey='owned' title='Owned'>
          <ProfileTokensView
            catalog={this.catalog}
            sort={this.sort}
            typeViewTokens={ProfileTokensType.purchases}
          />
        </Tab> */}
        <Tab eventKey='favourites' title='Favorites'>
          <ProfileTokensView
            catalog={this.catalog}
            sort={this.sort}
            typeViewTokens={ProfileTokensType.favourites}
          />
        </Tab>
      </Tabs>
    );
  }

  private set userProfile(profile) {
    this.setState({
      ...this.state,
      image: profile.image || avatarDefault,
      profile: {
        bio: profile.bio,
        email: profile.email,
        name: profile.name,
      },
    });
  }

  private updateActiveTab(key) {
    window.history.pushState({}, '', `${this.urlWithoutParam}?tab=${key}`);

    this.setState({
      ...this.state,
      activeTab: key,
    });
  }

  private get getUserId() {
    return this.props.params.userId!;
  }

  private get isMyProfile() {
    return this.props.near.user?.accountId === this.getUserId;
  }

  private get activeTabFromUrl() {
    try {
      return window.location.href.split('?tab=')[1].split('&')[0];
    } catch (e) {
      return window.location.href.split('?tab=')[1];
    }
  }

  private get urlWithoutParam() {
    return window.location.href.split('?tab=')[0];
  }

  private get catalog() {
    return this.state.catalog;
  }

  private get sort() {
    return this.state.sort;
  }

  public render() {
    return (
      <>
        <div className={`position-relative ${styles.profileWrap}`}>
          <div className='container'>
            <div className={styles.bgWrap}>
              <div className={styles.bgBlock} />
            </div>

            <div className={styles.profileInfoWrap}>
              <div className={styles.avatarWrap}>
                <img ref={this._refAvatar} onError={() => {
                  changeAvatarRefSrc(this._refAvatar);
                }} width='100' height='100' src={this.state.image} alt='avatar' />
                {this.isMyProfile && (
                  <div className={styles.uploadAvatarWrap}>
                    <label>
                      <input ref={this._inputFile} onChange={this.setSelectFile} hidden type='file' />
                      <img alt='icon' src={avatarUpload} />
                    </label>
                  </div>
                )}
                {this.state.isLoadAvatar &&
                  <div className={styles.avatarSpinnerWrap}><Spinner animation='grow' variant='light' /></div>}
              </div>
              <p className={styles.profileName}>{this.state.profile.name}</p>
              <IdentificationCopy id={this.getUserId} />
            </div>

            {!this.isMyProfile ? (
              <>
                <div className={styles.bioWrap}>{this.state.profile.bio}</div>
                {/*<ButtonView*/}
                {/*  text={'Follow'}*/}
                {/*  onClick={() => {*/}
                {/*  }}*/}
                {/*  color={buttonColors.goldFill}*/}
                {/*  customClass={styles.buttonFollow}*/}
                {/*/>*/}
                <InfoCounters />
              </>
            ) : null}
          </div>
          <div className={styles.tabsWrap}>
            {this.getProfileTabs()}
          </div>
        </div>
        <p className='line-separator' />
      </>
    );
  }
}

export default withComponent(UserProfile);
