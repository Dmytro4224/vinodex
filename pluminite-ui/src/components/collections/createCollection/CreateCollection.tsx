import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './createCollection.module.css';
import MediaQuery from 'react-responsive';
import defaultPreview from '../../../assets/images/vine-def.png';
import { RenderType } from '../Collections';

interface ICreateCollection extends IProps {
  changeRenderType?: (type: RenderType) => void;
}

class CreateCollection extends Component<ICreateCollection & IBaseComponentProps> {
  public state = {
    preview: {
      cover: 1,
      image: defaultPreview,
      name: ''
    }
  }

  constructor(props: ICreateCollection & IBaseComponentProps) {
    super(props);
  }

  public render() {
    return (
      <div className={`container ${styles.container}`}>
        <MediaQuery minWidth={992}>
          <div className={styles.previewWrap}>
            <div className={styles.bgPreview} />
            <div className={styles.imageWrap}>
              <img src={this.state.preview.image} alt='preview' />
            </div>
            <p className={styles.collectionName}>Collection name</p>
          </div>
        </MediaQuery>

        <div className={styles.containerWrap}>
          form
        </div>
      </div>
    );
  }
}

export default withComponent(CreateCollection);
