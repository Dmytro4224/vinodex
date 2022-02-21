import { Component } from "react";

interface IDescriptionView{
  text: string
}

class DescrtiptionView extends Component<IDescriptionView>{
  constructor(props: IDescriptionView) {
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

export { DescrtiptionView }
