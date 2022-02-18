import { Component } from 'react';
import styles from './tokenViewDetail.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';

interface ITokenViewDetail{
  hash: string;
  icon?: any;
  alt?: string;
}

class TokenViewDetail extends Component<ITokenViewDetail>{
  constructor(props: ITokenViewDetail) {
    super(props);
  }

  private get icon(){
    return this.props.icon || cardPreview
  }

  render(){
    return (
      <div className="d-flex align-items-center flex-gap-36">
          <div className={styles.tokenImage}>
            <img className={styles.imageStyle} src={this.icon} alt={this.props.alt || 'preview image'}/>
          </div>
          <div className={styles.tokenInfo}></div>
      </div>
    )
  }
}

export { TokenViewDetail }