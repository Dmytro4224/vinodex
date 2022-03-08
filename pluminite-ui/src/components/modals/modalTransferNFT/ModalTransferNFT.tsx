import React, { Component } from 'react';
import style from './modalTransferNFT.module.css';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import InputView, { InputType } from '../../common/inputView/InputView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { onlyNumber } from '../../../utils/sys';

interface IModalTransferNFT extends IProps {
  onHideModal: () => void;
  onSubmit: () => void;
  inShowModal: boolean;
  tokenInfo: any;
}

interface ModalTransferNFTState {
  isLoading: boolean;
  validate: {
    isNameValid: boolean,
    isNumbersCopyValid: boolean,
  };
}

class ModalTransferNFT extends Component<IModalTransferNFT & IBaseComponentProps> {
  private _initialState: ModalTransferNFTState | undefined;
  private _refInputUserName: any;
  private _refNumberOfCopies: any;

  public state: ModalTransferNFTState = {
    isLoading: false,
    validate: {
      isNameValid: true,
      isNumbersCopyValid: true,
    },
  };

  constructor(props: IModalTransferNFT & IBaseComponentProps) {
    super(props);
  }

  public componentWillMount() {
    this._initialState = this.state;
  }

  private resetState() {
    if (this._initialState) {
      this.setState(this._initialState);
    }

    try {
      this._refNumberOfCopies._ref.current.value = ``;
      this._refInputUserName._ref.current.value = ``;
    } catch (e) {
      console.warn(e);
    }
  }

  private get modalIsShow() {
    return this.props.inShowModal;
  }

  private get tokenInfo() {
    return this.props.tokenInfo;
  }

  private onHideModal() {
    this.props.onHideModal && this.props.onHideModal();
    this.resetState();
  }

  private isValidForm() {
    let validInfo = {
      name: true,
      numberCopies: true,
    };

    if (this._refInputUserName.value.trim() === '') {
      validInfo.name = false;
    }

    if (this._refNumberOfCopies.value.trim() === '' || Number(this._refNumberOfCopies.value) === 0) {
      validInfo.numberCopies = false;
    }

    if (!validInfo.name || !validInfo.numberCopies) {
      this.setState({
        ...this.state,
        validate: {
          isNameValid: validInfo.name,
          isNumbersCopyValid: validInfo.numberCopies,
        },
      });

      return false;
    }

    return true;
  }

  private onSubmit = async () => {
    if (!this.isValidForm()) return;

    this.setState({
      ...this.state,
      validate: {
        isNameValid: true,
        isNumbersCopyValid: true,
      },
      isLoading: true,
    });

    this.props.onSubmit && this.props.onSubmit();
  };

  render() {
    return (
      <ModalSample
        size={ModalSampleSizeType.lg}
        modalTitle={'Transfer NFT'}
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
              customClass={style.modalBtn}
            />

            <ButtonView
              text={'Save'}
              onClick={() => {
                this.onSubmit();
              }}
              isLoading={this.state.isLoading}
              color={buttonColors.goldFill}
              customClass={style.modalBtn}
            />
          </>
        }
      >
        <InputView
          placeholder={'User address or name*'}
          customClass={'mb-4'}
          value={this._refInputUserName?.value || ''}
          absPlaceholder={'User address or name*'}
          setRef={(ref) => {
            this._refInputUserName = ref;
          }}
          disabled={this.state.isLoading}
          isError={!this.state.validate.isNameValid}
          errorMessage={`Enter the Name`}
        />

        <InputView
          inputType={InputType.text}
          placeholder={'Number of copies*'}
          customClass={'mb-4'}
          value={this._refNumberOfCopies?.value || ''}
          absPlaceholder={'Number of copies*'}
          setRef={(ref) => {
            this._refNumberOfCopies = ref;
          }}
          disabled={this.state.isLoading}
          isError={!this.state.validate.isNumbersCopyValid}
          errorMessage={`Enter number of copies*`}
          onChange={(e) => {
            onlyNumber(e.target);
          }}
        />
      </ModalSample>
    );
  }
}

export default withComponent(ModalTransferNFT);
