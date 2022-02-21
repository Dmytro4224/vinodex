import React, { Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
import { withComponent } from "../../utils/withComponent";
import { Params } from 'react-router-dom';
import { INftContractContext } from '../../contexts/nftContract';
import { Tab, Tabs } from "react-bootstrap";
import { ProfileInfoDetails } from "../../components/profileInfoDetails/ProfileInfoDetails";
import { INftContract } from '../../utils';

interface IUserProfile {
    params: Params<string>;
    nftContractContext: INftContractContext
}

class UserProfile extends Component<IUserProfile> {
  private profile;

  constructor(props: IUserProfile) {
    super(props);
  }

  private get getUserId() {
    return this.props.params.userId!;
  }

  public componentDidMount() {
    this.props.nftContractContext.getProfile(this.getUserId).then(profile => {
      this.profile = profile;
    });
  }

  render() {
    return (
      <>
        <div className={`position-relative container ${styles.profileWrap}`}>
          <div className={styles.bgWrap}>
            <div className={styles.bgBlock} />
          </div>
          <div className={styles.profileInfoWrap}>
            <div className={styles.avatarWrap}>
              <img width="100" height="100" src={avatarDefault} alt="avatar" />
            </div>
            <p className={styles.profileName}>Profile Name</p>
            <IdentificationCopy id={this.getUserId} />
          </div>
          <div className={styles.tabsWrap}>
            <Tabs
              id="controlled-tab-example"
              className="mb-3 justify-content-center"
            >
              <Tab eventKey="details" title="Profile details">
                <ProfileInfoDetails />
              </Tab>
              <Tab eventKey="sale" title="On sale">
                <div>text2</div>
              </Tab>
              <Tab eventKey="items" title="Created Items">
                <div>text3</div>
              </Tab>
              <Tab eventKey="purchases" title="Purchases">
                <div>text4</div>
              </Tab>
              <Tab eventKey="birds" title="Active Bids">
                <div>text5</div>
              </Tab>
              <Tab eventKey="favourites" title="Favourites">
                <div>text6</div>
              </Tab>
              <Tab eventKey="following" title="Following">
                <div>text7</div>
              </Tab>
            </Tabs>
          </div>
        </div>

        <div className={styles.tabResultContainer}>

        </div>
    </>
    );
  }
}

export default withComponent(UserProfile);