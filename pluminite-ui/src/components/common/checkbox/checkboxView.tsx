import { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';

interface ICheckboxView extends IProps {
  checked?: boolean;
  label?: string;
  value: string;
  onChange?: (state: ICheckboxViewState) => void;
}

export interface ICheckboxViewState {
  checked: boolean;
  value: string;
  label?: string;
}

class CheckboxView extends Component<ICheckboxView & IBaseComponentProps, ICheckboxViewState> {

  constructor(props: ICheckboxView & IBaseComponentProps) {
    super(props);

    this.state = {
      checked: this.props.checked || false,
      value: this.props.value,
      label: this.props.label
    }
  }

  private onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //this.state.checked = e.target.checked;
    this.props.onChange && this.props.onChange(this.state);
  }

  public render() {
    return (
      <label>
        <input
          type={'checkbox'}
          value={this.props.value}
          checked={this.props.checked}
          onChange={this.onChange}
        />
        {this.state.label && (
          <span>{this.props.label}</span>
        )}
      </label>
    );
  }
}

export default withComponent(CheckboxView);
