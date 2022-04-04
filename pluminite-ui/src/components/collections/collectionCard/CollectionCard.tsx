import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './collectionCard.module.css';
import defaultImage from '../../../assets/images/vine-def.png';
import collectionCover from '../../../assets/images/collection-cover.jpg';
import pencil from '../../../assets/icons/pensil.svg';
import { RenderType } from '../Collections';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { ICollectionResponseItem } from '../../../types/ICollectionResponseItem';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import LikeView, { LikeViewType } from '../../like/likeView';
import { showToast } from '../../../utils/sys';
import { EShowTost } from '../../../types/ISysTypes';
import { NavLink } from 'react-router-dom';

interface ICollectionCard extends IProps {
  data?: ICollectionResponseItem;
  changeRenderType?: (type: RenderType, data?: ICollectionResponseItem | null) => void;
  isPreview?: boolean;
  type?: CollectionType;
  key?: string | number;
}

export enum CollectionType {
  default = 'default',
  big = 'big'
}

class CollectionCard extends Component<ICollectionCard & IBaseComponentProps> {
  private _isProcessLike: boolean;

  public state = {
    isShowModalPreview: false,
    isLike: this.props.data?.is_liked,
    likesCount: 0
  }

  constructor(props: ICollectionCard & IBaseComponentProps) {
    super(props);

    this._isProcessLike = false;
  }

  private changeRenderType(type: RenderType, data?: ICollectionResponseItem) {
    const collectionData = data || null;

    this.props.changeRenderType && this.props.changeRenderType(type, collectionData);
  }

  private get viewType() {
    return this.props.type || CollectionType.default;
  }

  private get isPreview() {
    return this.props.isPreview;
  }

  private get coverImage() {
    return this.props.data?.cover_photo || collectionCover;
  }

  private get image() {
    return this.props.data?.profile_photo || defaultImage;
  }

  private get collectionName() {
    return this.props.data?.name || 'Collection name';
  }

  private get creatorName() {
    if (this.isPreview) {
      return this.props.near.user?.accountId;
    }

    return this.props.data?.owner.account_id || 'Creator name';
  }

  private get key() {
    return this.props?.key || this.props.data?.collection_id || new Date().getTime();
  }

  private onErrorImage(type: string, target: any) {
    switch (type) {
      case 'cover':
        target.src = collectionCover;
        break;
      case 'logo':
        target.src = defaultImage;
        break;
    }
  }

  private get isMyCollection() {
    return this.props.data?.owner?.account_id === this.props.near.user?.accountId;
  }

  public changeLikeCount() {
    this.setState({
      ...this.state,
      isLike: !this.state.isLike,
      likesCount: !this.state.isLike ? this.state.likesCount + 1 : this.state.likesCount - 1,
    });
  }

  private toggleLikeCollection = async () => {
    if (!this.props.near.isAuth) {
      this.props.near.signIn();
      return;
    }

    try {
      if (this._isProcessLike) {
        return;
      }

      this._isProcessLike = true;

      this.changeLikeCount();

      await this.props.nftContractContext.collection_set_like(this.props.data?.collection_id!);

      this._isProcessLike = false;
    } catch (ex) {
      this._isProcessLike = false;

      this.changeLikeCount();

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error,
      });
    }
  }

  private getCardByType() {
    switch (this.viewType) {
      case CollectionType.default:
        return (
          <div key={this.key} className={`${styles.cardWrap} ${this.isPreview ? styles.preview : ''}`}>
            <div
              style={{ backgroundImage: `url(${this.coverImage})` }}
              className={styles.coverImage}
            />
            <div className={styles.imageWrap}>
              <img
                onError={(e) => { this.onErrorImage('logo', e.target) }}
                className={styles.image} src={this.image} alt='img' />
            </div>

            <div className={styles.actionsWrap}>
              <button className={`cursor-default ${styles.btnAction}`}>{this.props.data?.tokens?.length || 0}</button>

              {this.isMyCollection && this.props.changeRenderType && (
                <button
                  onClick={() => { this.changeRenderType(RenderType.collectionDetail, this.props.data) }}
                  className={styles.btnAction}
                >
                  <img width='17' height='17' src={pencil} alt='pencil' />
                </button>
              )}
            </div>

            <div className={styles.content}>
              <p className={`ellipsis ${styles.collectionName}`}>{this.collectionName}</p>
              <p className={`ellipsis ${styles.creatorName}`}>{this.creatorName}</p>

              {this.isPreview && (
                <>
                  <p className='line-separator my-3' />
                  <ButtonView
                    text={'PREVIEW'}
                    onClick={() => { this.setState({ ...this.state, isShowModalPreview: true }) }}
                    color={buttonColors.goldBordered}
                    customClass={'w-100'}
                  />

                  <ModalSample
                    customClass={`modalPreviewCollection`}
                    size={ModalSampleSizeType.xl}
                    modalTitle={''}
                    isShow={this.state.isShowModalPreview}
                    onHide={() => { this.setState({ ...this.state, isShowModalPreview: false }) }}
                    buttons={<></>}
                  >
                    <div
                      style={{ backgroundImage: `url(${this.coverImage})` }}
                      className={styles.modalPreviewCover}
                    />
                    <div className={styles.modalPreviewLogoWrap}>
                      <img
                        onError={(e) => { this.onErrorImage('logo', e.target) }}
                        className={styles.modalPreviewLogo} src={this.image} alt='img' />
                    </div>
                    <h4 className={styles.modalPreviewName}>{this.collectionName}</h4>
                    <p className={styles.modalPreviewDescription}>{this.props.data?.description || ''}</p>
                  </ModalSample>
                </>
              )}
            </div>
          </div>
        )
      case CollectionType.big:
        return (
          <div key={this.key} className={`cardWrapBig`}>
            <NavLink to={`/collections/${this.props.data?.collection_id}`}>
              <div
                style={{ backgroundImage: `url(${this.coverImage})` }}
                className={`cardWrapBig__coverImage`}
              />

              <div className={`cardWrapBig__imageWrap`}>
                <img
                  onError={(e) => { this.onErrorImage('logo', e.target) }}
                  className={`cardWrapBig__image`} src={this.image} alt='img' />
              </div>
            </NavLink>

            <div className={`cardWrapBig__content`}>
              <NavLink to={`/collections/${this.props.data?.collection_id}`}>
                <h4 className={`cardWrapBig__collectionName`}>{this.collectionName}</h4>
                <p className={`cardWrapBig__description`}>{(this.props.data?.description?.length || 0) > 180 ? `${this.props.data?.description?.slice(0, 180)}...` : this.props.data?.description}</p>
              </NavLink>

              <div className={`cardWrapBig__controls`}>
                <ButtonView
                  text={'explore the collection'}
                  onClick={() => { this.props.navigate(`/collections/${this.props.data?.collection_id}`) }}
                  color={buttonColors.goldFill}
                  customClass={``}
                />

                <div className='d-flex align-items-center gap-15px'>
                  <LikeView
                    customClass={styles.userInfo}
                    isChanged={false}
                    isActive={true}
                    type={LikeViewType.wine}
                    count={this.props.data?.tokens_count || 0}
                  />
                  <LikeView
                    customClass={styles.userInfo}
                    isChanged={false}
                    isActive={true}
                    type={LikeViewType.user}
                    count={this.props.data?.views_count || 0}
                  />
                  <LikeView
                    onClick={this.toggleLikeCollection}
                    isChanged={this.state.isLike || false}
                    customClass={styles.likes}
                    isActive={true}
                    type={LikeViewType.like}
                    count={this.props.data?.likes_count || 0}
                  />
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  public render() {
    return this.getCardByType();
  }
}

export default withComponent(CollectionCard);
