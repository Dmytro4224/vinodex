import React, { Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
import { withComponent } from "../../utils/withComponent";
import { TabsView, tabType } from "../../components/common/tabs/TabsView";
import { Params } from 'react-router-dom';
import { INftContractContext } from '../../contexts/nftContract';
import { INftContract } from '../../utils';

interface IUserProfile {
    params: Params<string>;
    nftContractContext: INftContractContext
}

class UserProfile extends Component<IUserProfile> {
  constructor(props) {
    super(props);
  }

  private get getUserId() {
    return this.props.params.userId!;
    }
    public componentDidMount() {
        this.props.nftContractContext.getProfile(this.getUserId).then(profile => {
            console.log('profile', profile);
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
            <TabsView
              tabItems={[
                { title: "Profile details", id: 1, link: "#" },
                { title: "On sale", id: 2, link: "#" },
                { title: "Created Items", id: 3, link: "#" },
                { title: "Purchases", id: 4, link: "#" },
                { title: "Active Bids", id: 5, link: "#" },
                { title: "Favourites", id: 6, link: "#" },
                { title: "Following", id: 7, link: "#" },
              ]}
              type={tabType.link}
              onClick={(item) => { console.log(item) }}
              currentTabIndex={0}
            />
          </div>
        </div>

        <div className={styles.tabResultContainer}>

        </div>
      </>
    );
  }
}

export default withComponent(UserProfile);