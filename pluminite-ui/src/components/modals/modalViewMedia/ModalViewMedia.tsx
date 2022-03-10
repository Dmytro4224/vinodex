import React, { Component } from 'react';
import style from './modalViewMedia.module.css';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import InputView, { InputType } from '../../common/inputView/InputView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { onlyNumber } from '../../../utils/sys';
import styles from '../../../pages/createToken/createToken.module.css';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import TokenCardView from "../../tokenCard/tokenCardView";

interface IModalViewMedia extends IProps {
  onHideModal: () => void;
  inShowModal: boolean;
  media: any;
}

class ModalViewMedia extends Component<IModalViewMedia & IBaseComponentProps> {
  constructor(props: IModalViewMedia & IBaseComponentProps) {
    super(props);
  }

  private get modalIsShow() {
    return this.props.inShowModal;
  }

  private onHideModal() {
    this.props.onHideModal && this.props.onHideModal();
  }

  render() {
    return (
      <ModalSample
        size={ModalSampleSizeType.xl}
        modalTitle={''}
        customClass={'transparent'}
        isShow={this.modalIsShow}
        onHide={() => {
          this.onHideModal();
        }}
        buttons={
          <></>
        }>
        {/*<iframe className={styles.iFrameStyle} width="1000" height="600" src={this.props.media.src}
                title="" frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen></iframe>*/}
        <div className="d-flex align-items-center justify-content-center w-100">
          <img className={style.image} src={this.props.media.src} alt=""/>
        </div>
      </ModalSample>
    );
  }
}

export default withComponent(ModalViewMedia);
