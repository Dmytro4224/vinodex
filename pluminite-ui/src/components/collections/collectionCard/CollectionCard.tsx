import React, { Component } from 'react';
import { IBaseComponentProps, withComponent } from '../../../utils/withComponent';
import styles from './collectionCard.module.css';
import defaultImage from '../../../assets/images/vine-def.png';
import pencil from '../../../assets/icons/pensil.svg';

class CollectionCard extends Component<IBaseComponentProps> {
  constructor(props) {
    super(props);
  }

  public render() {
    return (
      <div className={styles.cardWrap}>
        <div className={styles.coverImage} />
        <div className={styles.imageWrap}>
          <img width='60' height='60' src={defaultImage} alt='img' />
        </div>

        <div className={styles.actionsWrap}>
          <button className={`cursor-default ${styles.btnAction}`}>0</button>

          <button className={styles.btnAction}>
            <img width='17' height='17' src={pencil} alt='pencil' />
          </button>
        </div>

        <div className={styles.content}>
          <p className={`ellipsis ${styles.collectionName}`}>Collection name</p>
          <p className={`ellipsis ${styles.creatorName}`}>Creator name</p>
        </div>
      </div>
    );
  }
}

export default withComponent(CollectionCard);
