import { Component } from "react";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";

interface IDescriptionView extends IProps{
  text: string
}

class DescrtiptionView extends Component<IDescriptionView & IBaseComponentProps>{
  constructor(props: IDescriptionView & IBaseComponentProps) {
    super(props);
  }

  private get text(){
    return this.props.text;
  }

  render(){
    return (
      <div>{this.text}</div>
    )
  }
}

export default withComponent(DescrtiptionView);
