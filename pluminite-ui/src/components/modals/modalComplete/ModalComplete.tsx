import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import ModalSample from '../../common/modalSample/ModalSample';
import mailIconSrc from '../../../assets/icons/mail-icon.png';
import styles from './ModalComplete.module.css';

export interface IModalCompleteProps extends IProps {
  onHideModal?: () => void;
  inShowModal: boolean;
  setRef?: (impl: IModalComplete) => void;
}

interface IModalCompleteState {
}

export interface IModalComplete {
}

class ModalComplete extends Component<IModalCompleteProps & IBaseComponentProps, IModalCompleteState> implements IModalComplete {

  constructor(props: IModalCompleteProps & IBaseComponentProps) {
    super(props);

    this.state = {
    }
  }

  private onHideModal = async () => {
    this.props.onHideModal && this.props.onHideModal();
  }

  private get modalIsShow() {
    return this.props.inShowModal;
  }

  public render() {
    return (
      <ModalSample
        size={void 500}
        modalTitle={''}
        isShow={this.modalIsShow}
        onHide={() => {
          this.onHideModal();
        }}
        buttons={
          <div className={styles.buttons}>
            <ButtonView
              text={'Close'}
              onClick={this.onHideModal}
              color={buttonColors.goldBordered}
              customClass={styles.modalBtn}
            />
          </div>
        }
        alignButtons={'center'}
      >
        <div className={styles.wrapper}>
          <div className={styles.image}>
            <img className={styles.img} src={mailIconSrc} />
          </div>
          <div className={styles.title}>
            Thank you for subscribing!
          </div>
          <div className={styles.description}>
            You have successfuly subctibed to out news.<br/>
            We will write you a letter when we have interesting<br />
            news just for you!
          </div>
        </div>
      </ModalSample>
    );
  }
}

export default withComponent(ModalComplete);
