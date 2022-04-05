import React, { Component } from 'react';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './modalPayAttention.module.css';
import attention from '../../../assets/icons/attention.svg';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';

interface IModalAttention extends IProps {
  isLoading: boolean;
  modalIsShow: boolean;
  onHideModal: () => void;
  onConfirm: () => void;
}

type ModalTypesState = { }

class ModalPayAttention extends Component<IModalAttention & IBaseComponentProps> {
  public state: ModalTypesState = { };

  constructor(props: IModalAttention & IBaseComponentProps) {
    super(props);
  }

  private get modalIsShow() {
    return this.props.modalIsShow;
  }

  private onHideModal() {
    this.props.onHideModal && this.props.onHideModal();
  }

  private onConfirm() {
    this.props.onConfirm && this.props.onConfirm();
  }

  private get isLoading() {
    return this.props.isLoading;
  }

  render() {
    return (
      <ModalSample
        customClass={'modalClean modal-max-w-500'}
        size={ModalSampleSizeType.lg}
        modalTitle={''}
        isShow={this.modalIsShow}
        onHide={() => {
          this.onHideModal();
        }}
        buttons={
          <></>
        }
      >
        <div className={styles.modalWrap}>
          <img width='84' height='74' src={attention} alt='attention' />
          <p className={styles.title}>Pay attention!</p>
          <p className={styles.description}>After saving the token, editing will not be possible. Are you sure you want to save the data?</p>

          <div className={`d-flex align-items-center justify-content-center w-100`}>
            <ButtonView
              text={'Cancel'}
              onClick={() => { this.onHideModal() }}
              color={buttonColors.goldBordered}
              customClass={`min-w-100px py-2`}
              disabled={this.isLoading}
            />
            <ButtonView
              text={'Submit'}
              onClick={() => { this.onConfirm() }}
              color={buttonColors.goldFill}
              customClass={`min-w-100px  py-2`}
              isLoading={this.isLoading}
            />
          </div>
        </div>
      </ModalSample>
    );
  }
}

export default withComponent(ModalPayAttention);
