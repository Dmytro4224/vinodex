import React, { Component } from 'react';
import { onlyNumber } from '../../utils/sys';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import InputView from '../common/inputView/InputView';
import { SelectView } from '../common/select/selectView';
import style from './catalogFilter.module.css';
import close from '../../assets/icons/close.svg'
import closeSm from '../../assets/icons/close-sm.svg'
import { IFilterOptions } from '../../types/IFilterOptions';

export interface ICatalogFilterView extends IProps {
  setRef?: (view: CatalogFilterView) => void;
  setFilter: (filterOptions: IFilterOptions) => void;
}

class CatalogFilterView extends Component<ICatalogFilterView & IBaseComponentProps> {
  public state: IFilterOptions = {
    type: null,
    priceFrom: null,
    priceTo: null
  }

  public readonly _ref: React.RefObject<HTMLDivElement>;
  private _typeSelect: any;
  private _inputPriceFrom: any;
  private _inputPriceTo: any;
  private _initialState: IFilterOptions;
  private _timeoutToSetPrice: any;

  constructor(props: ICatalogFilterView & IBaseComponentProps) {
    super(props);

    this.props.setRef && this.props.setRef(this);
    this._ref = React.createRef();
    this._initialState = this.state;
  }

  public componentDidUpdate(prevState, currState) {
    if (
      currState.priceFrom !== this.state.priceFrom ||
      currState.priceTo !== this.state.priceTo ||
      currState.type !== this.state.type
    ) {
      if (!this.state.priceFrom) {
        this._inputPriceFrom.ref.current.value = ``;
      }

      if (!this.state.priceTo) {
        this._inputPriceTo.ref.current.value = ``;
      }

      this.setFilterOptions();
    }
  }

  public show() {
    if (this._ref.current) {
      this._ref.current.hidden = false;
    }
  }

  public hide() {
    if (this._ref.current) {
      this._ref.current.hidden = true;
    }
  }

  public toogle() {
    if (this._ref.current) {
      this._ref.current.hidden = !this._ref.current.hidden;
    }
  }

  private get isShowResult() {
    return this.state.priceFrom !== null || this.state.priceTo !== null || this.state.type !== null;
  }

  private clearState() {
    this.setState(this._initialState);
  }

  private setFilterOptions() {
    this.props.setFilter(this.state)
  }

  private getTypeToState(type: string | null) {
    switch (type) {
      case 'single':
        return true;
      case 'multiple':
        return false;
      default:
        return null;
    }
  }

  private getTypeFromState() {
    switch (this.state.type) {
      case true:
        return 'Single';
      case false:
        return 'Multiple';
      default:
        return null;
    }
  }

  private setPrice(type: string, value: string | null | number) {
    if (this._timeoutToSetPrice) clearTimeout(this._timeoutToSetPrice);

    this._timeoutToSetPrice = setTimeout(() => {
      switch (type) {
        case 'from':
          this.setState({
            ...this.state,
            priceFrom: value || null
          })
          break;
        case 'to':
          let val = value;

          if ((!val || Number(val) < Number(this.state.priceFrom)) && val !== '') {
            val = Number(this.state.priceFrom);
            this._inputPriceTo.ref.current.value = val;
          }

          this.setState({
            ...this.state,
            priceTo: val || null
          })
          break;
      }
    }, 600);
  }

  public render() {
    return (
      <div className={'mt-4'} ref={this._ref} hidden>
        <div className={`d-flex align-items-center ${style.filterWrap}`}>
          <SelectView
            setRef={ref => this._typeSelect = ref}
            onChange={item => {
              this.setState({
                ...this.state,
                type: this.getTypeToState(item?.value || null)
              })
            }}
            // selectedOpt={{ label: 'All', value: 'all' }}
            placeholder={'Type'}
            options={[{ label: 'All', value: 'all' }, { label: 'Single', value: 'single' }, { label: 'Multiple', value: 'multiple' }]}
            customCLass={style.select}
          />
          <InputView
            placeholder={'Price*'}
            customClass={`ml-4 ${style.inputView}`}
            value={this._inputPriceFrom?.value || ''}
            absPlaceholder={'Price from'}
            setRef={(ref) => {
              this._inputPriceFrom = ref;
            }}
            onChange={(e) => {
              onlyNumber(e.target);

              // @ts-ignore
              this.setPrice('from', e.target.value)
            }}
          />
          <InputView
            placeholder={'Price*'}
            customClass={`ml-4 ${style.inputView}`}
            value={this._inputPriceTo?.value || ''}
            absPlaceholder={'Price to'}
            setRef={(ref) => {
              this._inputPriceTo = ref;
            }}
            onChange={(e) => {
              onlyNumber(e.target);

              // @ts-ignore
              this.setPrice('to', e.target.value)
            }}
          />
        </div>

        {this.isShowResult && (
          <>
            <p className="line-separator my-4" />

            <div className={style.resultWrap}>
              <button
                onClick={() => { this.clearState() }}
                className={style.clearButton}
              >
                <img src={close} alt="clear" />&nbsp;Clear all
              </button>

              {this.getTypeFromState() && (
                <div className="d-flex align-items-center gap-5px">
                  <p>Type:</p>
                  <button
                    onClick={() => { this.setState({ ...this.state, type: null }) }}
                    className={`${style.resultItem} ${style.clearButton}`}
                  >
                    {this.getTypeFromState()}
                    <img src={closeSm} alt="remove" />
                  </button>
                </div>
              )}

              {this.state.priceFrom && (
                <div className="d-flex align-items-center gap-5px">
                  <p>Price from: </p>
                  <button
                    onClick={() => { this.setState({ ...this.state, priceFrom: null }) }}
                    className={`${style.resultItem} ${style.clearButton}`}
                  >
                    {this.state.priceFrom}
                    <img src={closeSm} alt="remove" />
                  </button>
                </div>
              )}

              {this.state.priceTo && (
                <div className="d-flex align-items-center gap-5px">
                  <p>Price to: </p>
                  <button
                    onClick={() => { this.setState({ ...this.state, priceTo: null }) }}
                    className={`${style.resultItem} ${style.clearButton}`}
                  >
                    {this.state.priceTo}
                    <img src={closeSm} alt="remove" />
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    );
  }
}

export default withComponent(CatalogFilterView);
