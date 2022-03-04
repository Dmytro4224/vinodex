import { Component } from 'react';
import styles from './mainLogoView.module.css';
import backArrowIcon from '../../assets/icons/arrow-back.svg';
import ButtonView, { buttonColors } from '../common/button/ButtonView';

interface ImainLogoView{
  img: any,
  title: string;
  isSmall?: boolean;
  onClick?: () => void
}

class MainLogoView extends Component<ImainLogoView>{
  constructor(props: ImainLogoView) {
    super(props);
  }

  public onClick = () => {
    this.props.onClick && this.props.onClick();
  }

  render(){
    return (
      <div className={`${styles.wrap} ${this.props.isSmall ? styles.smallWrap : ''}`}>
        <img className={styles.image} src={this.props.img} alt="main logo"/>
        <div className={styles.titleMainWrap}>
          {this.props.onClick ? <div className={styles.backButton}>
            <ButtonView
              text={""}
              withoutText={true}
              icon={backArrowIcon}
              onClick={() => { this.onClick() }}
              color={buttonColors.backButton}
            />
          </div> : ''}
          <div className={styles.titleWrap}>
            <span className={styles.title}>{this.props.title}</span>
          </div>
        </div>
      </div>
    )
  }
}

export { MainLogoView };
