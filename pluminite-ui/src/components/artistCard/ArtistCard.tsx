import { Component } from "react";
import LikeView, {LikeViewType } from "../like/likeView";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import { NavLink } from 'react-router-dom';
import { IdentificationCopy } from "../common/identificationCopy/IdentificationCopy";
import styles from './artistCard.module.css';
import defaultAvatar from '../../assets/images/avatar-def.png';
import {IBaseComponentProps, IProps, withComponent} from "../../utils/withComponent";
import {IAuthorResponseItem} from "../../types/IAuthorResponseItem";

interface IArtistCard extends IProps{
  info: IAuthorResponseItem;
  identification: string;
  usersCount: number;
  likesCount: number;
  isFollow: boolean;
  isCard?: boolean;
}

class ArtistCard extends Component<Readonly<IArtistCard & IBaseComponentProps>> {
  constructor(props: IArtistCard & IBaseComponentProps) {
    super(props);
  }

  private get avatar() {
    return this.props.info?.image;
  }

  private get name() {
    return this.props.info?.name;
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

  private get isCard() {
    return typeof this.props.isCard === 'undefined' ? true : this.props.isCard;
  }

  private btnFollowHandler() {}

  isCardType() {
    return (
      <div className={styles.artistCard}>
        <div className={styles.artistWrap}>
          <img className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt="avatar"/>
          <div>
            <NavLink to={`/userProfile/${this.identification}`}><p className={styles.artistName}>{this.name}</p></NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <ButtonView
            text={this.isFollow ? "Unfollow" : "Follow"}
            onClick={() => { this.btnFollowHandler() }}
            color={buttonColors.goldFill}
            customClass={styles.buttonFollow}
          />
          <div className="d-flex align-items-center">
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

  private oneLineType() {
    return (
      <div className="d-flex align-items-center justify-content-between w-100">
        <div className={styles.artistWrap}>
          <img className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt="avatar"/>
          <div>
            <NavLink to={`/userProfile/${this.identification}`}><p className={styles.artistName}>{this.name}</p></NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <LikeView
            customClass={`${styles.likes} ${styles.likesCustom}`}
            isChanged={false}
            isActive={true}
            type={LikeViewType.like}
            count={this.likesCount}
          />
          <ButtonView
            text={this.isFollow ? "Unfollow" : "Follow"}
            onClick={() => { this.btnFollowHandler() }}
            color={buttonColors.goldFill}
            customClass={styles.buttonFollow}
          />
        </div>
      </div>
    );
  }

  render() {
    return (
      <>{this.isCard ? this.isCardType() : this.oneLineType()}</>
    );
  }
}

export default withComponent(ArtistCard);