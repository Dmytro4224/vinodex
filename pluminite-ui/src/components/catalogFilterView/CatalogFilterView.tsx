import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import InputView, { IInputView, InputType } from '../common/inputView/InputView';
import { SelectView } from '../common/select/selectView';
import searchIcon from "../../assets/icons/search.svg";
import MultiSelectView from '../common/multiSelect/multiSelectView';
import CheckboxView from '../common/checkbox/checkboxView';

export interface ICatalogFilterView extends IProps {
  setRef?: (view: CatalogFilterView) => void;
}

export interface ICatalogFilterViewState {

}

class CatalogFilterView extends Component<ICatalogFilterView & IBaseComponentProps> {

  public readonly _ref: React.RefObject<HTMLDivElement>;
  private _tagsInput: any;
  private _typeSelect: any;
  private _entitySelect: any;

  constructor(props: ICatalogFilterView & IBaseComponentProps) {
    super(props);

    this.props.setRef && this.props.setRef(this);
    this._ref = React.createRef();
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

  public render() {
    return (
      <div ref={this._ref} hidden>
        <div className="d-flex align-items-center justify-content-between">
          <InputView
            inputType={InputType.text}
            placeholder={'Tags'}
            icon={searchIcon}
            setRef={ref => this._tagsInput = ref}
          />
          <SelectView
            setRef={ref => this._typeSelect = ref}
            onChange={item => {
              console.log('item', item);
            }}
            options={[{ label: 'Single', value: 'single' }, { label: 'Multiple', value: 'Multiple' }]}
            //selectedValue={'single'}
          />
          <MultiSelectView
            component={CheckboxView}
            //setRef={ref => this._entitySelect = ref}
            onChange={item => {
              console.log('item', item);
            }}
            options={[{ label: 'Single', value: 'single' }, { label: 'Multiple', value: 'Multiple' }]}
            selectedValue={'single'}
          />
          <InputView placeholder={''} inputType={InputType.text} />
          <InputView placeholder={''} inputType={InputType.text} />
          <InputView placeholder={''} inputType={InputType.text} />
        </div>
      </div>
    );
  }
}

export default withComponent(CatalogFilterView);
