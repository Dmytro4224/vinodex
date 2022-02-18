import { Component } from "react";
import { LikeView, LikeViewType } from "../like/likeView";
import { buttonColors, ButtonView } from "../common/button/ButtonView";
import { NavLink } from 'react-router-dom';
import { IdentificationCopy } from "../common/identificationCopy/IdentificationCopy";
import styles from './artistCard.module.css';
import defaultAvatar from '../../assets/images/avatar-def.png';
import {withComponent} from "../../utils/withComponent";

interface IArtistCard {
  avatar?: any;
  name: string;
  identification: string;
  usersCount: number;
  likesCount: number;
  isFollow: boolean;
}

class ArtistCard extends Component<Readonly<IArtistCard>> {
  constructor(props: IArtistCard) {
    super(props);
  }

  private get avatar() {
    return this.props.avatar;
  }

  private get name() {
    return this.props.name;
  }

  private get identification() {
    return this.props.identification;
  }

  private get usersCount() {
    return this.props.usersCount;
  }

  private get likesCount() {
    return this.props.likesCount;
  }

  private get isFollow() {
    return this.props.isFollow;
  }

  private btnFollowHandler() {}

  render() {
    return (
      <div className={styles.artistCard}>
        <div className={styles.artistWrap}>
          <img className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt="avatar"/>
          <div>
            <NavLink to={`/userProfile/${this.identification}`}><p className={styles.artistName}>{this.name}</p></NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className="d-flex align-center justify-content-between">
          <ButtonView
            text={this.isFollow ? "Unfollow" : "Follow"}
            onClick={() => { this.btnFollowHandler() }}
            color={buttonColors.blue}
            customClass={styles.buttonFollow}
          />
          <div className="d-flex align-center">
            <LikeView
              customClass={styles.userInfo}
              isChanged={false}
              isActive={true}
              type={LikeViewType.user}
              count={this.usersCount}
            />
            <LikeView
              customClass={styles.likes}
              isChanged={false}
              isActive={true}
              type={LikeViewType.like}
              count={this.likesCount}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withComponent(ArtistCard);