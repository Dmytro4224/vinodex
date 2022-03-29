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

interface ICollectionCard extends IProps {
  data?: ICollectionResponseItem;
  changeRenderType?: (type: RenderType, data?: ICollectionResponseItem | null) => void;
  isPreview?: boolean;
  key?: string;
}

class CollectionCard extends Component<ICollectionCard & IBaseComponentProps> {
  public state = {
    isShowModalPreview: false
  }

  constructor(props: ICollectionCard & IBaseComponentProps) {
    super(props);
  }

  private changeRenderType(type: RenderType, data?: ICollectionResponseItem) {
    const collectionData = data || null;

    this.props.changeRenderType && this.props.changeRenderType(type, collectionData);
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
    return this.props.key || new Date().getTime();
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

  public render() {
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

          <button
            onClick={() => { this.changeRenderType(RenderType.collectionDetail, this.props.data) }}
            className={styles.btnAction}>
            <img width='17' height='17' src={pencil} alt='pencil' />
          </button>
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
    );
  }
}

export default withComponent(CollectionCard);
