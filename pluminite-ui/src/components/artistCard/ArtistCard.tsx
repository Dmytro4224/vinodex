import { Component } from 'react';
import LikeView, { LikeViewType } from '../like/likeView';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import { NavLink } from 'react-router-dom';
import { IdentificationCopy } from '../common/identificationCopy/IdentificationCopy';
import styles from './artistCard.module.css';
import defaultAvatar from '../../assets/images/avatar-def.png';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { IAuthorResponseItem } from '../../types/IAuthorResponseItem';
import { changeAvatarRefSrc, showToast } from '../../utils/sys';
import { EShowTost } from '../../types/ISysTypes';
import React from 'react';

interface IArtistCard extends IProps {
  info: IAuthorResponseItem;
  identification: string;
  usersCount: number;
  likesCount: number;
  isFollow: boolean;
  isCard?: boolean;
  isLike: boolean;
  customClass?: string;
  followBtnText?: string;
  isDisabledFollowBtn?: boolean;
}

class ArtistCard extends Component<Readonly<IArtistCard & IBaseComponentProps>> {
  private _refAvatar: any;

  public state = {
    isLike: this.props.isLike,
    likesCount: this.likesCount,
    usersCount: this.props.usersCount,
    isFollow: this.isFollow,
    isProcessLike: false,
    isProcessFollow: false,
  };

  constructor(props: IArtistCard & IBaseComponentProps) {
    super(props);

    this._refAvatar = React.createRef();
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

  private get followBtnText() {
    return this.props.followBtnText;
  }

  private get isCard() {
    return typeof this.props.isCard === 'undefined' ? true : this.props.isCard;
  }

  private get isDisabledFollowBtn() {
    return this.props.isDisabledFollowBtn;
  }

  private get isMyUser() {
    return this.props.near.user?.accountId === this.identification;
  }

  public changeLikeCount() {
    this.setState({
      ...this.state,
      isLike: !this.state.isLike,
      likesCount: !this.state.isLike ? this.state.likesCount + 1 : this.state.likesCount - 1,
    });
  }

  public changeFollow() {
    this.setState({
      ...this.state,
      isFollow: !this.state.isFollow,
      usersCount: !this.state.isFollow ? this.state.usersCount + 1 : this.state.usersCount - 1,
    });
  }

  private btnFollowHandler = async () => {
    if (!this.props.near.isAuth) {
      this.props.near.signIn();
      return;
    }

    try {
      if (this.state.isProcessFollow) {
        return;
      }
      this.state.isProcessFollow = true;
      this.changeFollow();

      await this.props.nftContractContext.follow_artist_account(this.identification);

      this.state.isProcessFollow = false;
    } catch (ex) {
      this.state.isProcessFollow = false;
      this.changeFollow();

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error,
      });
    }
  };

  private toggleLikeAccount = async () => {
    if (!this.props.near.isAuth) {
      this.props.near.signIn();
      return;
    }

    try {
      if (this.state.isProcessLike) {
        return;
      }
      this.state.isProcessLike = true;
      this.changeLikeCount();

      await this.props.nftContractContext.like_artist_account(this.identification);

      this.state.isProcessLike = false;
    } catch (ex) {
      this.state.isProcessLike = false;
      console.warn('error', this.state.isLike);
      this.changeLikeCount();

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error,
      });
    }
  };

  isCardType() {
    return (
      <div className={`${styles.artistCard} ${this.props.customClass || ''}`}>
        <div className={styles.artistWrap}>
          <NavLink to={`/userProfile/${this.identification}`}>
            <img ref={this._refAvatar} onError={() => {
              changeAvatarRefSrc(this._refAvatar);
            }} className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt='avatar' />
          </NavLink>
          <div>
            <NavLink to={`/userProfile/${this.identification}`}>
              <p className={styles.artistName}>{this.name}</p>
            </NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className={`d-flex align-items-center justify-content-between ${this.isMyUser ? styles.pointerNone : ''}`}>
          {!this.isMyUser ? (
            <ButtonView
              text={this.followBtnText ? this.followBtnText : this.state.isFollow ? 'Unfollow' : 'Follow'}
              onClick={this.btnFollowHandler}
              color={buttonColors.goldFill}
              customClass={`${styles.buttonFollow} ${this.isDisabledFollowBtn ? styles.pointerNone : ''}`}
            />
          ) : <span>&nbsp;</span>}
          <div className='d-flex align-items-center'>
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
      <div className='d-flex align-items-center justify-content-between w-100'>
        <div className={styles.artistWrap}>
          <img ref={this._refAvatar} onError={() => {
            changeAvatarRefSrc(this._refAvatar);
          }} className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt='avatar' />
          <div>
            <NavLink to={`/userProfile/${this.identification}`}><p className={styles.artistName}>{this.name}</p>
            </NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div className={`d-flex align-items-center ${this.isMyUser ? styles.pointerNone : ''}`}>
          <LikeView
            onClick={this.toggleLikeAccount}
            customClass={`${styles.likes} ${styles.likesCustom}`}
            isChanged={false}
            isActive={true}
            type={LikeViewType.like}
            count={this.likesCount}
          />
          {!this.isMyUser && (
            <ButtonView
              text={this.state.isFollow ? 'Unfollow' : 'Follow'}
              onClick={this.btnFollowHandler}
              color={buttonColors.goldFill}
              customClass={styles.buttonFollow}
            />
          )}
        </div>
      </div>
    );
  }

  render() {
    return <> {this.isCard ? this.isCardType() : this.oneLineType()} </>;
  }
}

export default withComponent(ArtistCard);
