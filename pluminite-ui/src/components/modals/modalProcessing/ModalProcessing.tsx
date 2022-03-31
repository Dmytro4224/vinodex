import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import styles from './ModalProcessing.module.css';
import clockSrc from '../../../assets/images/processing-clock.png';
import ProgressBar, { IProgressBar, IProgressBarState } from '../../progressbar/ProgressBar';

export interface IModalProcessingProps extends IProps {
  onHideModal?: () => void;
  inShowModal: boolean;
  setRef?: (impl: IModalProcessing) => void;
  onComplete?: () => void;
}

export interface IModalProcessingState {
}

export interface IModalProcessing {
  progressBar?: IProgressBar;
} 

class ModalProcessing extends Component<IModalProcessingProps & IBaseComponentProps, IModalProcessingState> implements IModalProcessing {

  private _progressBar?: IProgressBar;

  constructor(props: IModalProcessingProps & IBaseComponentProps) {
    super(props);

    if (this.props.setRef !== void 0) {
      this.props.setRef(this);
    }
  }

  private onHideModal = async () => {
    this.props.onHideModal && this.props.onHideModal();
  }

  private get modalIsShow() {
    return this.props.inShowModal;
  }

  public get progressBar() {
    return this._progressBar;
  }

  private onComplete = async () => {
    if (this.props.onComplete !== void 0) {
      this.props.onComplete();
    }
  }

  public render() {
    return (
      <ModalSample
        size={void 500}
        modalTitle={''}
        isShow={this.modalIsShow}
        onHide={this.onHideModal}
        hasCloseButton={false}
      >
        <div className={styles.container}>
          <div className={`${styles.clock}`}>
            <img className={styles.image} src={clockSrc} />
          </div>
          <div className={styles.title}>
            Processin
          </div>
          <div className={styles.description}>
            A transaction is in progress to subscription to<br />Marketplace news
          </div>
          <div className={styles.progressbar}>
            <ProgressBar
              setRef={impl => this._progressBar = impl}
              onComplete={this.onComplete}
            />
          </div>
          <div className={styles.notes}>
            <p>This may take a few minutes.</p>
            <p>Plase, stay on this page!</p>
          </div>
        </div>
      </ModalSample>
    );
  }
}

export default withComponent(ModalProcessing);
