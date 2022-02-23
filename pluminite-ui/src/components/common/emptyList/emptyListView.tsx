import { Component } from "react";
import styles from './emptyListView.module.css';

interface IEmptyListView{
  text?: string
}

class EmptyListView extends Component<IEmptyListView>{
  constructor(props: IEmptyListView) {
    super(props);
  }

  private get text(){
    return this.props.text || 'No items found';
  }

  render(){
    return <div className={styles.container}>
      {this.text}
    </div>
  }
}

export { EmptyListView }