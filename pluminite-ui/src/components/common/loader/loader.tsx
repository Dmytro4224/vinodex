import { Component } from "react";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";

interface ILoader extends IProps{

}

class Loader extends Component<ILoader & IBaseComponentProps>{
  constructor(props: ILoader & IBaseComponentProps) {
    super(props);
  }

  render(){
    return <p className="w-100 text-center">is loading</p>
  }

}

export default withComponent(Loader);