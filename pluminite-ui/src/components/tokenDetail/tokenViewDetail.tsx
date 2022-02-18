import { Component } from 'react';
import styles from './tokenViewDetail.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import { ITokenCardView } from '../tokenCard/tokenCardView';
import { withComponent } from '../../utils/withComponent';

interface ITokenViewDetail{
  hash: string;
  icon?: any;
  alt?: string;
}

class TokenViewDetail extends Component<ITokenViewDetail>{
  private readonly _token: ITokenCardView;

  constructor(props: ITokenViewDetail) {
    super(props);

    this._token = {
      countL: 1,
      countR: 3,
      days: '123 left',
      name: 'test a',
      author: 'tester',
      likesCount: 1,
      buttonText: '111'
    }
  }

  private get icon(){
    return this.props.icon || cardPreview
  }

  private get days(){
    return this._token.days;
  }

  render(){
    // @ts-ignore
    console.log(`param`, this.props.params);

    return (
      <div className="d-flex align-items-center flex-gap-36">
          <div className={styles.cardImage}>
            <img className={styles.imageStyle} src={this.icon} alt={this.props.alt || 'preview image'}/>
            <div className={styles.cardDetail}>
              { this.days !== '' && <div className={styles.daysInfo}>
                {this.days}
              </div> }
            </div>
          </div>
          <div className={styles.tokenInfo}>

          </div>
      </div>
    )
  }
}

export default withComponent(TokenViewDetail)