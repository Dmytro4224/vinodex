import { Component } from "react";
import Select from "react-select";

interface ISelectViewItem{
  value: string;
  label: string;
}

interface ISelectView{
  options: Array<ISelectViewItem>;
  placeholder?: string;
  customCLass?: string;
  setRef?: any;
  onChange?: (item: ISelectViewItem) => void;
}

class SelectView extends Component<ISelectView>{
  private _ref: any;

  public state = {
    selectedOption: null,
  };

  constructor(props: ISelectView) {
    super(props);

    this.props.setRef && this.props.setRef(this);
  }

  handleChange = (selectedOption) => {
    if(this.props.onChange !== undefined){
      this.props.onChange(selectedOption);
    }

    this.setState({ selectedOption }, () =>
      console.log(`Option selected:`, this.state.selectedOption)
    );
  }

  public get selectedOption(){
    return this.state.selectedOption;
  }

  render() {
    const { selectedOption } = this.state;

    const customStyles = {
      option: (provided, state) => ({
        ...provided,
      }),
      valueContainer: (provided, state) => ({
        ...provided,
        background: '#F8F8F8',
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
      }
    }

    return (
      <Select className={this.props?.customCLass || ''} value={selectedOption}
        placeholder={this.props.placeholder || ''}
        styles={customStyles}
        onChange={this.handleChange}
        options={this.props.options}></Select>
    );
  }
}

export { SelectView }