import React, {Component} from "react";
import styles from './artistCard.module.css';
import defaultAvatar from '../../assets/images/avatar-def.png';
import copyIcon from '../../assets/icons/copy.svg'
import {transformArtistId} from "../../utils/sys";
import {LikeView, LikeViewType} from "../like/likeView";
import {buttonColors, ButtonView} from "../common/button/ButtonView";
import {PlacementType, TooltipS} from "../common/tooltip/Tooltip";

interface IArtistCard {
  avatar?: any;
  name: string;
  identification: string;
  usersCount: number;
  likesCount: number;
  isFollow: boolean;
}

class ArtistCard extends Component<Readonly<IArtistCard>> {
  private readonly _refIdentificationText:  React.RefObject<HTMLParagraphElement>;

  constructor(props: IArtistCard) {
    super(props);

    this._refIdentificationText = React.createRef();
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

  private copyToClipboard() {
    navigator.clipboard.writeText(this.identification);

    this._refIdentificationText.current?.classList.add(styles.colorCopySuccess);

    const t = setTimeout(() => {
      this._refIdentificationText.current?.classList.remove(styles.colorCopySuccess);
      clearTimeout(t);
    }, 1500);
  }

  render() {
    return (
      <div className={styles.artistCard}>
        <div className={styles.artistWrap}>
          <img className={styles.artistAvatar} src={this.avatar || defaultAvatar} alt="avatar"/>
          <div>
            <p className={styles.artistName}>{this.name}</p>
            <div className={styles.identificationWrap}>
              <p ref={this._refIdentificationText} className={styles.artistId}>{transformArtistId(this.identification)}</p>
              <TooltipS
                placement={PlacementType.top}
                text={`Copy to clipboard`}
                children={
                  <button
                    onClick={() => { this.copyToClipboard() }}
                    className={styles.btnCopy}>
                    <img src={copyIcon} alt="copy"/>
                  </button>
                }
              />
            </div>
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

export { ArtistCard };