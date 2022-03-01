import React, { Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { Tab, Tabs } from "react-bootstrap";
import InfoDetails  from "../../components/profile/infoDetails/InfoDetails";
import {EmptyListView} from "../../components/common/emptyList/emptyListView";

interface IUserProfile extends IProps {}

class UserProfile extends Component<IUserProfile & IBaseComponentProps> {
  public state = {
    image: avatarDefault,
    profile: {
      bio: 'Bio Example',
      email: 'User Name Example',
      name: 'User Name Example',
    }
  }

  constructor(props: IUserProfile & IBaseComponentProps) {
    super(props);
  }

  private get getUserId() {
    return this.props.params.userId!;
  }

  private get isMyProfile() {
    return this.props.near.user?.accountId === this.getUserId;
  }

  public componentDidMount() {
    if (!this.isMyProfile) {
      this.props.nftContractContext.view_artist_account(this.getUserId).then(res => {
        console.log("🚀 ~ file: UserProfile.tsx ~ line 31 ~ UserProfile ~ this.props.nftContractContext.view_artist_account ~ res", res)
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

  public updateUserInfo(profile) {
    this.setState({
      ...this.state,
      profile: {
        bio: profile.bio,
        email: profile.email,
        name: profile.name
      }
    })
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
                <img width="100" height="100" src={this.state.image} alt="avatar" />
              </div>
              <p className={styles.profileName}>{this.state.profile.name}</p>
              <IdentificationCopy id={this.getUserId} />
            </div>
          </div>
          <div className={styles.tabsWrap}>
            <Tabs
              id="controlled-tab-example"
              className="mb-3 justify-content-center"
            >
              <Tab eventKey="details" title="Profile details">
                <InfoDetails
                  isMyProfile={this.isMyProfile}
                  userId={this.getUserId}
                  profile={this.state.profile}
                  updateUserInfo={(profile) => { this.updateUserInfo(profile) }}
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
              <Tab eventKey="favourites" title="Favourites">
                <div style={{ minHeight: '300px' }}><EmptyListView /></div>
              </Tab>
              <Tab eventKey="following" title="Following">
                <div style={{ minHeight: '300px' }}><EmptyListView /></div>
              </Tab>
            </Tabs>
          </div>
        </div>
    </>
    );
  }
}

export default withComponent(UserProfile);