import React, { Component } from 'react';
import style from './modalSaleToken.module.css';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import InputView, { InputType } from '../../common/inputView/InputView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { onlyNumber } from '../../../utils/sys';
import styles from '../../../pages/createToken/createToken.module.css';

interface IModalSaleToken extends IProps {
  onHideModal: () => void;
  onSubmit: () => void;
  inShowModal: boolean;
  tokenInfo: any;
}

interface ModalSaleTokenState {
  isLoading: boolean;
  validate: {
    isPriceValid: boolean,
    isNumbersCopyValid: boolean,
  };
}

class ModalSaleToken extends Component<IModalSaleToken & IBaseComponentProps> {
  private _initialState: ModalSaleTokenState | undefined;
  private _refInputPrice: any;
  private _refNumberOfCopies: any;

  public state: ModalSaleTokenState = {
    isLoading: false,
    validate: {
      isPriceValid: true,
      isNumbersCopyValid: true,
    },
  };

  constructor(props: IModalSaleToken & IBaseComponentProps) {
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
      this._refNumberOfCopies.value = ``;
      this._refInputPrice.value = ``;
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
      price: true,
      numberCopies: true,
    };

    if (this._refInputPrice.value.trim() === '') {
      validInfo.price = false;
    }

    if (this._refNumberOfCopies.value.trim() === '' || Number(this._refNumberOfCopies.value) === 0) {
      validInfo.numberCopies = false;
    }

    if (!validInfo.price || !validInfo.numberCopies) {
      this.setState({
        ...this.state,
        validate: {
          isPriceValid: validInfo.price,
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
        isPriceValid: true,
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
        modalTitle={'Sale on Marketplace'}
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
              text={'Apply'}
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
          value={this._refInputPrice?.value || ''}
          absPlaceholder={'Number of copies*'}
          setRef={(ref) => {
            this._refInputPrice = ref;
          }}
          disabled={this.state.isLoading}
          isError={!this.state.validate.isNumbersCopyValid}
          errorMessage={`Enter number of copies`}
          onChange={(e) => {
            onlyNumber(e.target);
          }}
        />

        <InputView
          inputType={InputType.text}
          placeholder={'Number of copies*'}
          customClass={'mb-1'}
          value={this._refNumberOfCopies?.value || ''}
          absPlaceholder={'Price*'}
          setRef={(ref) => {
            this._refNumberOfCopies = ref;
          }}
          disabled={this.state.isLoading}
          isError={!this.state.validate.isPriceValid}
          errorMessage={`Enter the price`}
          onChange={(e) => {
            onlyNumber(e.target);
          }}
        />
        <p className={styles.inputSubText}>Service fee: <b>2.5%</b>, You will receive: <b>0.00 NEAR</b></p>
      </ModalSample>
    );
  }
}

export default withComponent(ModalSaleToken);
