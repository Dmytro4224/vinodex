import { Component } from "react";
import LikeView, { LikeViewType } from "../like/likeView";
import ButtonView, { buttonColors } from "../common/button/ButtonView";
import { NavLink } from 'react-router-dom';
import { IdentificationCopy } from "../common/identificationCopy/IdentificationCopy";
import styles from './artistCard.module.css';
import defaultAvatar from '../../assets/images/avatar-def.png';
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { IAuthorResponseItem } from "../../types/IAuthorResponseItem";
import { showToast } from "../../utils/sys";
import { EShowTost } from "../../types/ISysTypes";

interface IArtistCard extends IProps {
  info: IAuthorResponseItem;
  identification: string;
  usersCount: number;
  likesCount: number;
  isFollow: boolean;
  isCard?: boolean;
  isLike: boolean;
}

class ArtistCard extends Component<Readonly<IArtistCard & IBaseComponentProps>> {
  public state = {
    isLike: this.props.isLike,
    likesCount: this.likesCount,
    usersCount: this.props.usersCount,
    isFollow: this.isFollow,
    isProcessLike: false,
    isProcessFollow: false
  }

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
    return this.state.usersCount;
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
  public changeLikeCount(count: number,isLike: boolean){
    this.setState({
      ...this.state,
      isLike: isLike,
      likesCount: count
    })
  }
  public changeFollow(count: number,isFollow: boolean){
    this.setState({
      ...this.state,
      isFollow: !this.state.isFollow,
      usersCount:count
    })
  }
  private btnFollowHandler = async () => {
    try {
      if (this.state.isProcessFollow){
        return
      }
      this.state.isProcessFollow = true;
      this.changeFollow(!this.state.isFollow ? this.state.usersCount + 1 : this.state.usersCount - 1,!this.state.isFollow);
      await this.props.nftContractContext.follow_artist_account(this.identification)
      this.state.isProcessFollow = false;
    }catch (ex) {
      this.state.isProcessFollow = false;
      this.changeLikeCount( this.state.usersCount,this.state.isFollow);
      console.warn("🚀 ~ file: ArtistCard.tsx ~ line 68 ~ ArtistCard ~ btnFollowHandler ~ error", ex)
      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error
      });
    }
  }

  private  toggleLikeAccount = async () => {
    try {
      if (this.state.isProcessLike){
        return
      }
      this.state.isProcessLike = true;
      this.changeLikeCount(!this.state.isLike ? this.state.likesCount + 1 : this.state.likesCount - 1,!this.state.isLike);
      await this.props.nftContractContext.like_artist_account(this.identification);
      this.state.isProcessLike = false;
    } catch(ex) {
      this.state.isProcessLike = false;
      this.changeLikeCount( this.state.likesCount,this.state.isLike);
      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error
      });
    }
  }

  isCardType() {
    return (
      <div className={styles.artistCard}>
        <div className={styles.artistWrap}>
          <NavLink to={`/userProfile/${this.identification}`}>
            <img className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt="avatar" />
          </NavLink>
          <div>
            <NavLink to={`/userProfile/${this.identification}`}>
              <p className={styles.artistName}>{this.name}</p>
            </NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <ButtonView
            text={this.state.isFollow ? "Unfollow" : "Follow"}
            onClick={this.btnFollowHandler}
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
              onClick={this.toggleLikeAccount}
              isChanged={this.state.isLike}
              customClass={styles.likes}
              isActive={true}
              type={LikeViewType.like}
              count={this.state.likesCount}
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
          <img className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt="avatar" />
          <div>
            <NavLink to={`/userProfile/${this.identification}`}><p className={styles.artistName}>{this.name}</p></NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className="d-flex align-items-center">
          <LikeView
            onClick={this.toggleLikeAccount}
            customClass={`${styles.likes} ${styles.likesCustom}`}
            isChanged={false}
            isActive={true}
            type={LikeViewType.like}
            count={this.likesCount}
          />
          <ButtonView
            text={this.state.isFollow ? "Unfollow" : "Follow"}
            onClick={this.btnFollowHandler}
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
