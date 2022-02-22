import { Component } from 'react';
import {IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './labelView.module.css';

interface ILableView extends IProps{
  text: string;
  customClass?: string
}

class LabelView extends Component<Readonly<ILableView & IBaseComponentProps>>{
    constructor(props: ILableView & IBaseComponentProps) {
      super(props);
    }

    private get text(){
      return this.props.text;
    }

    render(){
      return (
        <h3 className={styles.title}>
          {this.text}
        </h3>
      )
    }
}

export  default withComponent(LabelView);