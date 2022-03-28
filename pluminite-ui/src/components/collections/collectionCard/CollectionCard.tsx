import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './collectionCard.module.css';
import defaultImage from '../../../assets/images/vine-def.png';
import pencil from '../../../assets/icons/pensil.svg';
import { RenderType } from '../Collections';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';

interface ICollectionCard extends IProps {
  changeRenderType?: (type: RenderType) => void;
  isPreview?: boolean;
}

class CollectionCard extends Component<ICollectionCard & IBaseComponentProps> {
  constructor(props: ICollectionCard & IBaseComponentProps) {
    super(props);
  }

  private changeRenderType(type: RenderType) {
    this.props.changeRenderType && this.props.changeRenderType(type);
  }

  private get isPreview() {
    return this.props.isPreview;
  }

  public render() {
    return (
      <div className={`${styles.cardWrap} ${this.isPreview ? styles.preview : ''}`}>
        <div className={styles.coverImage} />
        <div className={styles.imageWrap}>
          <img width='60' height='60' src={defaultImage} alt='img' />
        </div>

        <div className={styles.actionsWrap}>
          <button className={`cursor-default ${styles.btnAction}`}>0</button>

          <button
            onClick={() => { this.changeRenderType(RenderType.collectionDetail) }}
            className={styles.btnAction}>
            <img width='17' height='17' src={pencil} alt='pencil' />
          </button>
        </div>

        <div className={styles.content}>
          <p className={`ellipsis ${styles.collectionName}`}>Collection name</p>
          <p className={`ellipsis ${styles.creatorName}`}>Creator name</p>

          {this.isPreview && (
            <>
              <p className='line-separator my-3' />
              <ButtonView
                text={'PREVIEW'}
                onClick={() => { }}
                color={buttonColors.goldBordered}
                customClass={'w-100'}
              />
            </>
          )}
        </div>
      </div>
    );
  }
}

export default withComponent(CollectionCard);
