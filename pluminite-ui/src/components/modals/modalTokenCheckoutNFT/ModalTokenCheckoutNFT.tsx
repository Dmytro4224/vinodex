import React, { Component } from 'react';
import style from './modalTokenCheckoutNFT.module.css';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import InputView, { InputType } from '../../common/inputView/InputView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { onlyNumber } from '../../../utils/sys';
import styles from '../../../pages/createToken/createToken.module.css';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import TokenCardView from "../../tokenCard/tokenCardView";

interface IModalTokenCheckoutNFT extends IProps {
  onHideModal: () => void;
  onSubmit: () => void;
  inShowModal: boolean;
  tokenInfo: any;
  token: ITokenResponseItem | null
}

interface IModalTokenCheckoutNFTState {
  isLoading: boolean;
  validate: {
    isNumbersCopyValid: boolean,
  };
}

class ModalTokenCheckoutNFT extends Component<IModalTokenCheckoutNFT & IBaseComponentProps> {
  private _initialState: IModalTokenCheckoutNFTState | undefined;
  private _refNumberOfCopies: any;

  public state: IModalTokenCheckoutNFTState = {
    isLoading: false,
    validate: {
      isNumbersCopyValid: true,
    },
  };

  constructor(props: IModalTokenCheckoutNFT & IBaseComponentProps) {
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
      numberCopies: true,
    };

    if (this._refNumberOfCopies.value.trim() === '' || Number(this._refNumberOfCopies.value) === 0) {
      validInfo.numberCopies = false;
    }

    if (!validInfo.numberCopies) {
      this.setState({
        ...this.state,
        validate: {
          isNumbersCopyValid: validInfo.numberCopies,
        },
      });

      return false;
    }

    return true;
  }

  private onSubmit = async () => {
    if (this.props.token?.metadata.copies && parseFloat(this.props.token?.metadata.copies) > 1){
      if(!this.isValidForm()){
        return;
      }
    }

    this.setState({
      ...this.state,
      validate: {
        isNumbersCopyValid: true,
      },
      isLoading: true,
    });

    this.props.onSubmit && this.props.onSubmit();
  };

  render() {
    return (
      <ModalSample
        size={ModalSampleSizeType.sm}
        modalTitle={'Checkout'}
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
              text={'Buy'}
              onClick={() => {
                this.onSubmit();
              }}
              isLoading={this.state.isLoading}
              color={buttonColors.goldFill}
              customClass={`${style.modalBtn} ${style.buyBtn}`}
            />
          </>
        }
      >
        { this.props.token ? <TokenCardView key={`${ModalTokenCheckoutNFT.name}-${this.props.token.token_id}`}
                                            model={this.props.token}
                                            countL={0}
                                            countR={0}
                                            days={this.props.token.metadata.expires_at}
                                            name={this.props.token.metadata.title}
                                            author={this.props.token.owner_id}
                                            icon={this.props.token.metadata.media}
                                            isSmall={true}
                                            isView={true}
                                            tokenID={this.props.token.token_id}
                                            isLike={this.props.token.is_like}
                                            customClass={style.viewCard}
                                            onClick={() => { }} /> : '' }
        <p className={style.price}>Price {this.props.token?.metadata.price} NEAR</p>
        {this.props.token?.metadata.copies && parseFloat(this.props.token?.metadata.copies) > 1 ? <InputView
          inputType={InputType.text}
          placeholder={'Number of copies*'}
          customClass={'mb-1'}
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
        /> : ''}
        <p className={style.line}></p>
        <div className={style.totalWrap}>
          <p className={style.totalTitle}>Total amount</p>
          <p className={style.total}>{this.props.token?.metadata.price}NEAR</p>
        </div>
      </ModalSample>
    );
  }
}

export default withComponent(ModalTokenCheckoutNFT);
