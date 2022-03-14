import { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';

export interface IMultiSelectViewItem {
  label: string;
  value: string;
  checked?: boolean;
  
}

interface IMultiSelectView extends IProps {
  component: any;
  options: Array<IMultiSelectViewItem>;
  selectedValue?: string;
  onChange?: (item: IMultiSelectViewItem) => void;
}

interface IIMultiSelectViewState {
  
}

class MultiSelectView extends Component<IMultiSelectView & IBaseComponentProps, IIMultiSelectViewState> {

  private readonly _options: Array<IMultiSelectViewItem>;
  private readonly _component: any;

  constructor(props: IMultiSelectView & IBaseComponentProps) {
    super(props);

    this._options = this.props.options.slice(0);
    this._component = this.props.component;
  }

  public render() {
    const ItemComponent = this._component;
    return (
      <div>
        <div></div>
        <div>
          {this._options.map(opt => <ItemComponent value={opt.value} label={opt.label} checked={opt.checked} />)}
        </div>
      </div>
    );
  }
}

export default withComponent(MultiSelectView);
