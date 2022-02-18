import { Component } from "react";
import styles from './userProfile.module.css';
import avatarDefault from '../../assets/images/default-avatar-big.png';
import { IdentificationCopy } from "../../components/common/identificationCopy/IdentificationCopy";
class UserProfile extends Component {
  constructor(props) {
    super(props);

    // const userID = this.props.match.params;
  }

  render() {
    return (
      <div className="position-relative">
        <div className={styles.bgWrap}>
          <div className={styles.bgBlock} />
        </div>
        <div className={styles.profileInfoWrap}>
          <div className={styles.avatarWrap}>
            <img width="100" height="100" src={avatarDefault} alt="avatar" />
          </div>
          <p className={styles.profileName}>Profile Name</p>
          <IdentificationCopy id={'98712948KAJSHFy394821'} />
        </div>
      </div>
    );
  }
}

export { UserProfile }; 