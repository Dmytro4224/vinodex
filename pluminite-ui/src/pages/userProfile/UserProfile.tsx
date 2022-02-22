import React, { Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { Params } from 'react-router-dom';
import { INftContractContext } from '../../contexts/nftContract';
import { Tab, Tabs } from "react-bootstrap";
import { InfoDetails } from "../../components/profile/infoDetails/InfoDetails";
import { INftContract } from '../../utils';

interface IUserProfile extends IProps {
    
}

class UserProfile extends Component<IUserProfile & IBaseComponentProps, {}, any> {
  private profile;

    constructor(props: IUserProfile & IBaseComponentProps) {
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
        <div className={`position-relative ${styles.profileWrap}`}>
          <div className="container">
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
          </div>
          <div className={styles.tabsWrap}>
            <Tabs
              id="controlled-tab-example"
              className="mb-3 justify-content-center"
            >
              <Tab eventKey="details" title="Profile details">
                <InfoDetails />
              </Tab>
              <Tab eventKey="sale" title="On sale">
              </Tab>
              <Tab eventKey="items" title="Created Items">
              </Tab>
              <Tab eventKey="purchases" title="Purchases">
              </Tab>
              <Tab eventKey="birds" title="Active Bids">
              </Tab>
              <Tab eventKey="favourites" title="Favourites">
              </Tab>
              <Tab eventKey="following" title="Following">
              </Tab>
            </Tabs>
          </div>
        </div>
    </>
    );
  }
}

export default withComponent(UserProfile);