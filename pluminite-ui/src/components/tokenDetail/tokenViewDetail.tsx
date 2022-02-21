import { Component } from 'react';
import styles from './tokenViewDetail.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import { ITokenCardView } from '../tokenCard/tokenCardView';
import { withComponent } from '../../utils/withComponent';
import {LikeView, LikeViewType } from '../like/likeView';
import ArtistCard from '../artistCard/ArtistCard';
import {Tab, Tabs } from 'react-bootstrap';
import {buttonColors, ButtonView } from '../common/button/ButtonView';
import { DescrtiptionView } from '../description/descrtiptionView';

interface ITokenViewDetail{
  hash: string;
  icon?: any;
  alt?: string;
}

interface ICategory{
  text: string
}

class Category extends Component<ICategory>{
  constructor(props: ICategory) {
    super(props);
  }

  private get text(){
    return this.props.text;
  }

  render(){
    return(
      <div className={styles.category}>{this.text}</div>
    )
  }
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

  private get name(){
    return this._token.name;
  }

  private get countL(){
    return this._token.countL;
  }

  private get countR(){
    return this._token.countR;
  }

  render(){
    // @ts-ignore
    console.log(`param`, this.props.params);

    return (
      <div className="d-flex flex-gap-36">
          <div className={styles.cardImage}>
            <div className={styles.cardImageWrap}>
              <img className={styles.imageStyle} src={this.icon} alt={this.props.alt || 'preview image'}/>
              <div className={styles.cardDetail}>
                { this.days !== '' && <div className={styles.daysInfo}>
                  {this.days}
                </div> }
              </div>
            </div>
          </div>
          <div className={styles.tokenInfo}>
            <div className={styles.titleWrap}>
              <div className={styles.titleInfo}>
                <h3>{this.name}</h3>
                <div className={styles.avalialbeItems}>
                  <p className={styles.title}>Available items:</p>
                  <span className={styles.counts}>{this.countL}/{this.countR}</span>
                </div>
              </div>
              <div className={styles.likesInfo}>
                <LikeView
                  customClass={styles.likes}
                  isChanged={false}
                  isActive={true}
                  type={LikeViewType.like}
                  count={22}
                />
              </div>
            </div>
            <div className={styles.categoriesList}>
              <Category text={'Category 1'} />
              <Category text={'Category 2'} />
            </div>
            <div className={styles.creator}>
              <p className={styles.title}>Creator</p>
              <ArtistCard
                key={12}
                name={'Artist Name'}
                identification={'0x0b9D2weq28asdqwe132'}
                usersCount={22}
                likesCount={12}
                isCard={false}
                isFollow={false}
              />
            </div>
            <div className={styles.tabsWrap}>
              <Tabs
                id="controlled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="home" title="DESCRIPTION">
                    <div className={styles.tabContainer}>
                      <DescrtiptionView text={'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat'}/>
                    </div>
                </Tab>
                <Tab eventKey="profile" title="DETAILS">
                  <div className={styles.tabContainer}>text2</div>
                </Tab>
                <Tab eventKey="contact" title="HISTORY">
                  <div className={styles.tabContainer}>text3</div>
                </Tab>
                <Tab eventKey="owners" title="OWNERS">
                  <div className={styles.tabContainer}>text4</div>
                </Tab>
              </Tabs>
            </div>
            <div className={styles.buttonWrap}>
              <ButtonView
                text={'Place a bid 0.08 ETH'}
                onClick={() => {  }}
                color={buttonColors.goldFill}
                customClass={styles.button}
              />
            </div>
          </div>
      </div>
    )
  }
}

export default withComponent(TokenViewDetail)
