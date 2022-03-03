import { Component } from 'react';
import styles from './mainLogoView.module.css';

interface ImainLogoView{
  img: any,
  title: string
}

class MainLogoView extends Component<ImainLogoView>{
  constructor(props: ImainLogoView) {
    super(props);
  }

  render(){
    return (
      <div className={styles.wrap}>
        <img className={styles.image} src={this.props.img} alt="main logo"/>
        <div className={styles.titleMainWrap}>
          <div className={styles.titleWrap}>
            <span className={styles.title}>{this.props.title}</span>
          </div>
        </div>
      </div>
    )
  }
}

export { MainLogoView };