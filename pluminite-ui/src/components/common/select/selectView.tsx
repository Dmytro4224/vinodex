import { Component } from 'react';
import Select, { ActionMeta } from 'react-select';

export interface ISelectViewItem {
  value: string;
  label: string;
}

interface ISelectView {
  options: Array<ISelectViewItem>;
  placeholder?: string;
  customCLass?: string;
  setRef?: any;
  selectedOpt?: any;
  onChange: (item: ISelectViewItem | null) => void;
}

interface ISelectState {
  selectedOption: ISelectViewItem | null;
}

class SelectView extends Component<ISelectView, ISelectState> {
  public state = {
    selectedOption: this.props.selectedOpt || null,
  };

  private _ref: any;

  constructor(props: ISelectView) {
    super(props);

    this.props.setRef && this.props.setRef(this);
  }

  handleChange = (selectedOption: ISelectViewItem | null, actionMeta: ActionMeta<ISelectViewItem>) => {
    if (this.props.onChange !== undefined) {
      this.props.onChange(selectedOption);
    }

    this.setState({ selectedOption }, () => { });
  };

  public get selectedOption() {
    return this.state.selectedOption;
  }

  render() {
    const { selectedOption } = this.state;

    const customStyles = {
      option: (provided, state) => {
        const backgroundColor = state.isSelected ? 'var(--pirateCold)' : 'var(--white)';
        const color = state.isSelected ? 'var(--white)' : 'var(--black)';

        return {
        ...provided,
          cursor: 'pointer',
          backgroundColor,
          color
        }
      },
      control: (provided, state) => ({
        ...provided,
        border: 'none',
      }),
      placeholder: (provided, state) => ({
        ...provided,
        color: '#737272',
        fontWeight: '500',
        fontSize: '15px'
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        background: '#F8F8F8',
        minHeight: '56px',
      }),
      indicatorsContainer: (provided, state) => ({
        ...provided,
        background: '#F8F8F8',
      }),
      indicatorSeparator: (provided, state) => ({
        ...provided,
        opacity: 0,
      }),
      singleValue: (provided, state) => {
        const opacity = state.isDisabled ? 0.5 : 1;
        const transition = 'opacity 300ms';

        return { ...provided, opacity, transition };
      },
    };

    return (
      <Select
        className={this.props?.customCLass || ''}
        value={selectedOption}
        placeholder={this.props.placeholder || ''}
        styles={customStyles}
        onChange={this.handleChange}
        options={this.props.options}
      />
    );
  }
}

export { SelectView };
