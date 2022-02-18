import React, { Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
import { withComponent } from "../../utils/withComponent";
import { TabsView, tabType } from "../../components/common/tabs/TabsView";

class UserProfile extends Component {
  constructor(props) {
    super(props);
  }

  private get getUserId() {
    // @ts-ignore
    return this.props.params?.userId;
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
              type={tabType.button}
              onClick={(item) => { console.log(item) }}
              currentTabIndex={0}
            />
          </div>
        </div>

        <div></div>
      </>
    );
  }
}

export default withComponent(UserProfile);