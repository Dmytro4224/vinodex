import React, { Component } from 'react';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './modalConfirm.module.css';

interface IModalConfirm extends IProps {
  onHideModal: () => void;
  onSubmit: () => void;
  inShowModal: boolean;
  confirmText: string;
}

interface IModalConfirmState {
}

class ModalConfirm extends Component<IModalConfirm & IBaseComponentProps> {
  public state: IModalConfirmState = {};

  constructor(props: IModalConfirm & IBaseComponentProps) {
    super(props);
  }

  private get modalIsShow() {
    return this.props.inShowModal;
  }

  private onHideModal() {
    this.props.onHideModal && this.props.onHideModal();
  }


  private onSubmit = async () => {
    this.props.onSubmit && this.props.onSubmit()
  };

  render() {
    return (
      <ModalSample
        size={ModalSampleSizeType.lg}
        modalTitle={'Confirm your actions'}
        isShow={this.modalIsShow}
        onHide={() => {
          this.onHideModal();
        }}
        buttons={
          <>
            <ButtonView
              text={'Cancel'}
              onClick={() => {
                this.onHideModal();
              }}
              color={buttonColors.gray}
              customClass={styles.modalBtn}
            />

            <ButtonView
              text={'Confirm'}
              onClick={() => {
                this.onSubmit();
              }}
              isLoading={false}
              color={buttonColors.goldFill}
              customClass={styles.modalBtn}
            />
          </>
        }
      >
        <p className={styles.textConform}>{this.props.confirmText}</p>
      </ModalSample>
    );
  }
}

export default withComponent(ModalConfirm);