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
  isLoading: boolean;
}

class ModalConfirm extends Component<IModalConfirm & IBaseComponentProps, IModalConfirmState> {
  public state = {
    isLoading: false
  };

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
                this.setState({...this.state, isLoading: true})
                this.onSubmit();
              }}
              isLoading={this.state.isLoading}
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
