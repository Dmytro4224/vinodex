import React, { Component } from 'react';
import style from './modalTokenCheckoutNFT.module.css';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import InputView, { InputType } from '../../common/inputView/InputView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import {convertNearToYoctoString, convertYoctoNearsToNears, onlyNumber, showToast, validateDotNum } from '../../../utils/sys';
import styles from '../../../pages/createToken/createToken.module.css';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import TokenCardView from '../../tokenCard/tokenCardView';
import { TokensType } from '../../../types/TokenTypes';
import { EShowTost } from '../../../types/ISysTypes';

interface IModalTokenCheckoutNFT extends IProps {
  onHideModal: () => void;
  onSubmit: () => void;
  inShowModal: boolean;
  tokenInfo: any;
  token: ITokenResponseItem | null;
}

interface IModalTokenCheckoutNFTState {
  isLoading: boolean;
  validate: {
    isNumbersCopyValid: boolean,
    isOfferValid: boolean,
    isBidValid: boolean,
  };
}

class ModalTokenCheckoutNFT extends Component<IModalTokenCheckoutNFT & IBaseComponentProps> {
  private _initialState: IModalTokenCheckoutNFTState | undefined;
  private _refNumberOfCopies: any;
  private _refOffer: any;
  private _lastBid: any;

  public state: IModalTokenCheckoutNFTState = {
    isLoading: false,
    validate: {
      isNumbersCopyValid: true,
      isOfferValid: true,
      isBidValid: true,
    },
  };

  constructor(props: IModalTokenCheckoutNFT & IBaseComponentProps) {
    super(props);
  }

  public componentWillMount() {
    this._initialState = this.state;

    if(this.typeView === TokensType.timedAuction || this.typeView === TokensType.unlimitedAuction){
      if(this.props.token?.sale.bids.length > 0){
        this._lastBid = this.props.token?.sale.bids[this.props.token?.sale.bids.length - 1];
      }
    }
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

    try {
      if(this._refOffer) this._refOffer.value = ``;
    } catch (e) {}
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
      offer: true,
      bid: true,
    };

    // @ts-ignore
    if (this.props.token?.metadata.copies && parseFloat(this.props.token?.metadata.copies) > 1) {
      if (this._refNumberOfCopies.value.trim() === '' || Number(this._refNumberOfCopies.value) === 0) {
        validInfo.numberCopies = false;
      }
    }

    if(this.typeView === TokensType.timedAuction || this.typeView === TokensType.unlimitedAuction){
      if (this._refOffer.value.trim() === '' || Number(this._refOffer.value) === 0) {
        validInfo.offer = false;
      }

      if(this.props.token?.sale.bids.length > 0){
        let lastBid = this.props.token?.sale.bids[this.props.token?.sale.bids.length - 1];

        if(lastBid && (convertYoctoNearsToNears(lastBid.price) >= Number(this._refOffer.value))){
          validInfo.bid = false
        }
      }
    }

    if (!validInfo.numberCopies || !validInfo.offer || !validInfo.bid) {
      this.setState({
        ...this.state,
        validate: {
          isNumbersCopyValid: validInfo.numberCopies,
          isOfferValid: validInfo.offer,
          isBidValid: validInfo.bid,
        },
      });

      return false;
    }

    return true;
  }

  private onSubmit = async () => {

    if (this.props.token?.metadata.copies && parseFloat(this.props.token?.metadata.copies) > 1) {
      if (!this.isValidForm()) {
        return;
      }
    }

    this.setState({
      ...this.state,
      validate: {
        isNumbersCopyValid: true,
        isOfferValid: true,
        isBidValid: true,
      },
      isLoading: true,
    });

    if (!this.props.token?.token_id) { return }

    const price = this.props.token.sale.price ? this.props.token.sale.price : null;
    console.log(price);


    this.props.nftContractContext.sale_offer(
      this.props.token?.token_id,
      new Date().getTime(),
      void 0,
      price
    ).then(res => {
      this.onHideModal();
      this.props.onSubmit && this.props.onSubmit();
    }).catch(ex => {
      showToast({
        message: ex.kind.ExecutionError || `Error. Please, try again`,
        type: EShowTost.error
      });
      this.setState({
        ...this.state,
        isLoading: false,
      });
    });
  };

  private onStartPlace = async () => {
    if (!this.isValidForm()) {
      return;
    }

    this.setState({
      ...this.state,
      validate: {
        isNumbersCopyValid: true,
        isOfferValid: true,
        isBidValid: true,
      },
      isLoading: true,
    });

    if(!this.props.token?.token_id){ return }

    this.props.nftContractContext.sale_offer(
      this.props.token?.token_id,
      new Date().getTime(),
      this._refOffer && convertNearToYoctoString(parseFloat(this._refOffer.value)),
    ).then(res => {
      this.onHideModal();
      this.props.onSubmit && this.props.onSubmit();
    }).catch(ex => {
      showToast({
        message: ex.kind.ExecutionError || `Error. Please, try again`,
        type: EShowTost.error
      });
      this.setState({
        ...this.state,
        isLoading: false,
      });
    });;
  };
  private get isMyToken() {
    return this.props.token?.owner_id === this.props.near.user?.accountId;
  }

  private get typeView() {
    if (!this.props.token || !this.props.token?.sale) return TokensType.created;

    switch (this.props.token.sale.sale_type) {
      case 1:
        return TokensType.fixedPrice;
      case 2:
        return TokensType.timedAuction;
      case 3:
        return TokensType.unlimitedAuction;
    }
  }

  private getCardControls() {
    switch (this.typeView) {
      case TokensType.fixedPrice:
        return (
          <>
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
        );
      case TokensType.timedAuction:
      case TokensType.unlimitedAuction:
        return (
          <>
            <ButtonView
              text={'Place a bid'}
              onClick={() => {
                this.onStartPlace();
              }}
              isLoading={this.state.isLoading}
              color={buttonColors.goldFill}
              customClass={`${style.modalBtn} ${style.buyBtn}`}
            />
          </>
        );
    }
  }

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
            {this.getCardControls()}
          </>
        }
      >
        {this.props.token ? (
          <TokenCardView
            key={this.props.token.token_id}
            model={this.props.token}
            countL={0}
            countR={0}
            days={this.props.token.metadata.expires_at}
            name={this.props.token.metadata.title}
            author={this.props.token.owner_id}
            icon={this.props.token.metadata.media}
            isSmall={false}
            isView={true}
            tokenID={this.props.token.token_id}
            isLike={this.props.token.is_like}
            customClass={style.viewCard}
            isForceVisible={true}
            onClick={() => {
            }} />
        ) : ''}
        {this.props.token?.sale && <p className={style.price}>Price {convertYoctoNearsToNears(this.props.token?.sale.price)} NEAR</p>}
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
        {this.typeView === TokensType.timedAuction || this.typeView === TokensType.unlimitedAuction ? <InputView
          inputType={InputType.text}
          placeholder={'Offer*'}
          customClass={'mb-1'}
          value={this._refOffer?.value || ''}
          absPlaceholder={'Offer*'}
          setRef={(ref) => {
            this._refOffer = ref;
          }}
          disabled={this.state.isLoading}
          isError={!this.state.validate.isOfferValid}
          errorMessage={`Enter offer*`}
          onChange={(e) => {
            validateDotNum(e.target);
          }}
        /> : ''}

        <p className={style.line}></p>
        <div className={style.totalWrap}>
          <p className={style.totalTitle}>Total amount</p>
          {this.props.token?.sale && <p className={style.total}>{convertYoctoNearsToNears(this.props.token?.sale.price)}NEAR</p>}
        </div>
        {(!this.state.validate.isBidValid || this._lastBid) && <div className={style.errorBox}>
          <p>The offer must be greater than {convertYoctoNearsToNears(this._lastBid.price)} NEAR</p>
        </div>}
      </ModalSample>
    );
  }
}

export default withComponent(ModalTokenCheckoutNFT);
