import { Component } from "react";
import Select from "react-select";

interface ISelectViewItem{
  value: string;
  label: string;
}

interface ISelectView{
  options: Array<ISelectViewItem>;
  placeholder?: string;
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

    return (
      <Select value={selectedOption}
        placeholder={this.props.placeholder || ''}
        onChange={this.handleChange}
        options={this.props.options}></Select>
    );
  }
}

export { SelectView }