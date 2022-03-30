import React from 'react';
import { Component } from 'react';
import styles from './likeView.module.css';
import userIcon from '../../assets/icons/user-icon-gold.svg';
import likeIcon from '../../assets/icons/favorite-icon-gold.svg';
import likeIconFill from '../../assets/icons/favorite-icon-fill-gold.svg';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import eyeIcon from '../../assets/icons/eye-gold.svg';
import wineIcon from '../../assets/icons/wine-icon.svg';

interface ILikeView extends IProps {
  isChanged: boolean;
  isActive: boolean;
  customClass?: string,
  type: LikeViewType;
  count: number;
  onClick?: () => void;
  icon?: any;
}

enum LikeViewType {
  like = 'like',
  user = 'user',
  eye = 'eye',
  wine = 'wine'
}

class LikeView extends Component<ILikeView & IBaseComponentProps> {
  private _refImg: React.RefObject<HTMLImageElement>;
  private _refCount: React.RefObject<HTMLSpanElement>;
  private _count: number;
  private _isChanged: boolean;

  constructor(props: ILikeView & IBaseComponentProps) {
    super(props);

    this._isChanged = this.props.isChanged || false;
    this._count = this.props.count || 0;
    this._refImg = React.createRef();
    this._refCount = React.createRef();
  }

  public set count(value: number) {
    this._count = value;

    if (this._refCount.current == null) {
      return;
    }

    this._refCount.current.innerHTML = this._count.toString();
  }

  private changedIcon = async () => {
    this._isChanged = !this._isChanged;

    if (this._refImg.current == null) {
      return;
    }

    if (this._isChanged) {
      this.count = this._count + 1;
      this._refImg.current.src = likeIconFill;
    } else {
      this.count = this._count > 0 ? this._count - 1 : 0;
      this._refImg.current.src = likeIcon;
    }
  };

  private onClickHandler = async () => {
    this.props.onClick && this.props.onClick();
  };

  get isChanged() {
    return this.props.isChanged;
  }

  private renderLikeType() {
    return (
      <>
        <img
          ref={this._refImg}
          onClick={this.onClickHandler}
          className={styles.likeImage}
          src={this.isChanged ? likeIconFill : likeIcon}
          alt={''}
          width="20"
          height="20"
        />
        <span ref={this._refCount} className={styles.count}>{this.props.count}</span>
      </>
    );
  }

  private renderUserType() {
    return (
      <>
        <img width='20' height='20' ref={this._refImg} src={userIcon} alt={''} />
        <span ref={this._refCount} className={styles.count}>{this.props.count}</span>
      </>
    );
  }

  private renderEyeType() {
    return (
      <>
        <img width='20' height='18' ref={this._refImg} src={eyeIcon} alt={''} />
        <span ref={this._refCount} className={styles.count}>{this.props.count}</span>
      </>
    );
  }

  private renderWineType() {
    return (
      <>
        <img width='20' height='20' ref={this._refImg} src={wineIcon} alt={''} />
        <span ref={this._refCount} className={styles.count}>{this.props.count}</span>
      </>
    );
  }

  private renderType() {
    switch (this.props.type) {
      case LikeViewType.like:
        return this.renderLikeType();
      case LikeViewType.user:
        return this.renderUserType();
      case LikeViewType.eye:
        return this.renderEyeType();
      case LikeViewType.wine:
        return this.renderWineType();
    }
  }

  public render() {
    return (
      <div className={`${styles.iconStyle} ${this.props.customClass || ''}`}>
        {this.renderType()}
      </div>
    );
  }
}

export default withComponent(LikeView);
export { LikeViewType };
