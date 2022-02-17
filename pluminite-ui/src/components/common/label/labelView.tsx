import { Component } from 'react';
import styles from './labelView.module.css';

interface ILableView{
  text: string;
  customClass?: string
}

class LabelView extends Component<Readonly<ILableView>>{
    constructor(props: ILableView) {
      super(props);
    }

    private get text(){
      return this.props.text;
    }

    render(){
      return (
        <h3>
          {this.text}
        </h3>
      )
    }
}