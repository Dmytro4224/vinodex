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
import Skeleton from 'react-loading-skeleton';
import LazyLoad, { forceVisible } from 'react-lazyload';
import { nftStorage } from '../../api/NftStorage';
import cover from '../../assets/images/user-profile-bg.jpg';
import defaultImage from '../../assets/images/vine-def.png';

interface IArtistCard extends IProps {
  info: IAuthorResponseItem;
  identification: string;
  usersCount: number;
  likesCount: number;
  isFollow: boolean;
  type?: ArtistType;
  title?: string;
  isLike: boolean;
  customClass?: string;
  followBtnText?: string;
  isDisabledFollowBtn?: boolean;
  isForceVisible?: boolean;
  withoutControls?: boolean;
}

export enum ArtistType {
  card = 'card',
  oneline = 'oneline',
  info = 'info',
  big = 'big',
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

  public componentDidUpdate() {
    this.props.isForceVisible && forceVisible();
  }

  private get type() {
    return this.props.type || ArtistType.card;
  }

  private get title() {
    return this.props.title || '';
  }

  private get avatar() {
    return nftStorage.replaceOldUrl(this.props.info?.image);
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

  private isCardType() {
    return (
      <LazyLoad
        unmountIfInvisible={false}
        height={200}
        placeholder={
          <div style={{ width: '100%' }}>
            <Skeleton count={1} height={60} />
            <Skeleton count={2} height={20} />
          </div>
        }
        debounce={400}
        className={`${styles.artistCard} ${this.props.customClass || ''}`}
      >
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
      </LazyLoad>
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
            <NavLink to={`/userProfile/${this.identification}`}>
              <p className={styles.artistName}>{this.name}</p>
            </NavLink>
            <IdentificationCopy id={this.identification} />
          </div>
        </div>
        <div
          className={`d-flex align-items-center ${this.isMyUser ? styles.pointerNone : ''} ${this.props.withoutControls ? 'd-none' : ''}`}>
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

  private isInfoType() {
    return (
      <div className='d-flex align-items-center justify-content-between w-100'>
        <div className={`${styles.artistWrap} ${styles.infoStyle}`}>
          <img
            ref={this._refAvatar}
            onError={() => { changeAvatarRefSrc(this._refAvatar); }}
            className={styles.artistAvatar}
            src={this.avatar || defaultAvatar}
            alt='avatar'
          />
          <div>
            <p className={styles.infoTitle}>{this.title || 'Creator'}</p>
            <NavLink to={`/userProfile/${this.identification}`}>
              <p className={styles.artistName}>{this.name}</p>
            </NavLink>
          </div>
        </div>
      </div>
    );
  }

  private get coverImage() {
    return cover;
  }

  private get image() {
    return this.avatar || defaultAvatar;
  }

  private onErrorImage(type: string, target: any) {
    switch (type) {
      case 'cover':
        target.src = cover;
        break;
      case 'logo':
        target.src = defaultImage;
        break;
    }
  }

  private isBigType() {
    return (
      <div key={this.identification} className={`cardWrapBig`}>
        <div
          style={{ backgroundImage: `url(${this.coverImage})` }}
          className={`cardWrapBig__coverImage`}
        />

        <div className={`cardWrapBig__imageWrap`}>
          <img
            onError={(e) => { this.onErrorImage('logo', e.target) }}
            className={`cardWrapBig__image`} src={this.image} alt='img' />
        </div>

        <div className={`cardWrapBig__content`}>
          <h4 className={`cardWrapBig__creatorName`}>{this.name}</h4>

          <div className='my-3 d-flex align-items-center justify-content-center'>
            <IdentificationCopy id={this.identification} />
          </div>

          <p className={`cardWrapBig__description`}>{(this.props.info?.bio?.length || 0) > 180 ? `${this.props.info?.bio?.slice(0, 180)}...` : this.props.info?.bio}</p>

          <div className={`cardWrapBig__controls`}>
            {!this.isMyUser ? (
              <ButtonView
                text={this.state.isFollow ? 'Unfollow' : 'Follow'}
                onClick={this.btnFollowHandler}
                color={buttonColors.goldFill}
                customClass={`${styles.buttonFollow} min-w-100px`}
              />
            ) : <span />}

            <div className={`d-flex align-items-center gap-15px ${this.isMyUser ? styles.pointerNone : ''}`}>
              <LikeView
                customClass={`cardWrapBig__userInfo`}
                isChanged={false}
                isActive={true}
                type={LikeViewType.wine}
                count={0}
              />
              <LikeView
                customClass={`cardWrapBig__userInfo`}
                isChanged={false}
                isActive={true}
                type={LikeViewType.user}
                count={this.usersCount}
              />
              <LikeView
                onClick={this.toggleLikeAccount}
                customClass={`${styles.likes} ${styles.likesCustom}`}
                isChanged={false}
                isActive={true}
                type={LikeViewType.like}
                count={this.likesCount}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private getRenderByType() {
    switch (this.type) {
      case ArtistType.card:
        return this.isCardType();
      case ArtistType.oneline:
        return this.oneLineType();
      case ArtistType.info:
        return this.isInfoType();
      case ArtistType.big:
        return this.isBigType();
    }
  }

  public render() {
    return this.getRenderByType();
  }
}

export default withComponent(ArtistCard);
