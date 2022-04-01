import { Component } from 'react';
import styles from './mainLogoView.module.css';
import backArrowIcon from '../../assets/icons/arrow-back.svg';
import ButtonView, { buttonColors } from '../common/button/ButtonView';

interface ImainLogoView{
  img: any,
  title: string;
  isSmall?: boolean;
  onClick?: () => void,
  breadcrumbs?: any;
  bgWrap?: string;
  bgHeadInfo?: string;
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
      <div
        style={{
          backgroundImage: `url(${this.props.img})`,
          backgroundColor: `${this.props.bgWrap || '#2B231E'}`
        }}
        className={`${styles.wrap} ${this.props.isSmall ? styles.smallWrap : ''}`}
      >
        <div className={styles.titleMainWrap}>
          {this.props.onClick && (
            <div className={styles.backButton}>
              <ButtonView
                text={""}
                withoutText={true}
                icon={backArrowIcon}
                onClick={() => { this.onClick() }}
                color={buttonColors.backButton}
              />
            </div>
          )}

          <div
            style={{
              backgroundColor: `${this.props.bgHeadInfo || 'rgba(174, 126, 3, .9)'}`
            }}
            className={styles.titleWrap}
          >
            <span className={styles.title}>{this.props.title}</span>

            {this.props.breadcrumbs && (
              <div className='breadcrumb'>
                {this.props.breadcrumbs}
              </div>
            )}

          </div>
        </div>
      </div>
    )
  }
}

export { MainLogoView };
