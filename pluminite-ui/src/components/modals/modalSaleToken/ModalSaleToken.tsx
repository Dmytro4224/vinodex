import React, { Component } from 'react';
import style from './modalSaleToken.module.css';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import InputView, { InputType } from '../../common/inputView/InputView';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { onlyNumber } from '../../../utils/sys';
import styles from '../../../pages/createToken/createToken.module.css';
import { SelectView } from '../../common/select/selectView';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IModalSaleToken extends IProps {
  onHideModal: () => void;
  onSubmit: ({saleType, price, start_date, end_date }: { saleType: number, price?: number, start_date?: any, end_date?: any }) => void;
  inShowModal: boolean;
  tokenInfo: ITokenResponseItem | null | undefined;
}

interface ModalSaleTokenState {
  isLoading: boolean;
  selectType: string;
  errorMessage: string;
  startDate: Date,
  expDate: Date,
  minExpDate: Date,
  validate: {
    isPriceValid: boolean,
  };
}

class ModalSaleToken extends Component<IModalSaleToken & IBaseComponentProps> {
  private _initialState: ModalSaleTokenState | undefined;
  private _refInputPrice: any;
  private _refCatalogSelect: any;
  private _addTime: number = 900_000;

  public state: ModalSaleTokenState = {
    isLoading: false,
    selectType: '1',
    errorMessage: '',
    startDate: new Date(),
    expDate: new Date(new Date().getTime() + this._addTime),
    minExpDate: new Date(),
    validate: {
      isPriceValid: true,
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
      this._refCatalogSelect.value = ``;
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
      errorMessage: '',
    };

    switch (this.state.selectType) {
      case '1':
        if (this._refInputPrice.value.trim() === '' || +this._refInputPrice.value === 0) {
          validInfo.price = false;
        }

        break;
      case '2':
        if (!this.state.startDate || !this.state.expDate) {
          validInfo.errorMessage = 'Enter start and end date';
        }

        break;
      case '3':
        break;
    }

    if (!validInfo.price || validInfo.errorMessage) {
      this.setState({
        ...this.state,
        errorMessage: validInfo.errorMessage,
        validate: {
          isPriceValid: validInfo.price,
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
        isSelectTypeValid: true,
      },
      isLoading: true,
    });

    this.props.onSubmit && this.props.onSubmit({
      saleType: +this.state.selectType,
      price: +this._refInputPrice.value,
      start_date: this.state.startDate || '',
      end_date: this.state.expDate || '',
    });
  };

  private filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  }

  private filterPassedTimeExpDate = (time) => {
    const currentDate = new Date(this.state.startDate);
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  }

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
        <label className={`w-100`}>
          <p className={`mb-1 ${styles.inputSubText}`}>Sale type</p>
          <SelectView
            options={[
              {
                value: '1',
                label: 'Fixed price',
              },
              {
                value: '2',
                label: 'Timed auction',
              },
              // {
              //   value: '3',
              //   label: 'Unlimited auction',
              // },
            ]}
            selectedOpt={{ value: '1', label: 'Fixed price' }}
            customCLass={styles.selectStyle}
            placeholder={'Sale type'}
            onChange={(opt) => {
              this.setState({
                ...this.state,
                errorMessage: '',
                validate: {
                  isPriceValid: true,
                },
                selectType: opt?.value,
              });
            }}
            setRef={(ref) => {
              this._refCatalogSelect = ref;
            }}
          />
        </label>

        {this.state.selectType === '1' ? (
          <>
            <InputView
              placeholder={'Price*'}
              customClass={'mt-4'}
              value={this._refInputPrice?.value || ''}
              absPlaceholder={'Price*'}
              setRef={(ref) => {
                this._refInputPrice = ref;
              }}
              disabled={this.state.isLoading}
              isError={!this.state.validate.isPriceValid}
              errorMessage={`Enter the price`}
              onChange={(e) => {
                onlyNumber(e.target);
              }}
            />
          </>
        ) : this.state.selectType === '2' ? (
          <div className={'mt-4'}>
            <label className={styles.inputLabel}>Set a period of time for which buyers can place bids</label>
            <div className={'d-flex align-items-center flex-gap-36 mt-3'}>
              <DatePicker
                selected={this.state.startDate}
                onChange={(date) => {
                  this.setState({
                    ...this.state,
                    startDate: date,
                    expDate: new Date(new Date(date).getTime() + this._addTime),
                    minExpDate: date
                  })
                }}
                showTimeSelect
                timeFormat="p"
                timeIntervals={15}
                dateFormat="Pp"
                minDate={new Date()}
                filterTime={this.filterPassedTime}
                withPortal
                placeholderText="Click to select a start date"
                className={'form-control'}
              />

              <DatePicker
                selected={this.state.expDate}
                onChange={(date) => this.setState({ ...this.state, expDate: date })}
                showTimeSelect
                timeFormat="p"
                timeIntervals={15}
                dateFormat="Pp"
                minDate={this.state.minExpDate}
                filterTime={this.filterPassedTimeExpDate}
                withPortal
                placeholderText="Click to select end date"
                className={'form-control'}
              />
            </div>
          </div>
        ) : ''}

        {this.state.errorMessage && <p className={styles.errorMessage}>{this.state.errorMessage}</p>}
      </ModalSample>
    );
  }
}

export default withComponent(ModalSaleToken);
