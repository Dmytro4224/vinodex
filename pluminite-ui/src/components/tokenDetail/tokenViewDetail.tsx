import { Component } from 'react';
import styles from './tokenViewDetail.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import { ITokenCardView } from '../tokenCard/tokenCardView';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import LikeView, {LikeViewType } from '../like/likeView';
import ArtistCard from '../artistCard/ArtistCard';
import {Tab, Tabs } from 'react-bootstrap';
import ButtonView, {buttonColors } from '../common/button/ButtonView';
import DescrtiptionView  from '../description/descrtiptionView';
import TokenDetailView  from './tabs/detail/tokenDetailView';
import BidsView  from './tabs/bids/bidsView';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import Skeleton from 'react-loading-skeleton';
import React from 'react';

interface ITokenViewDetail extends IProps {
  hash?: string;
}

interface ICategory extends IProps {
  text: string
}

class Category extends Component<ICategory & IBaseComponentProps, {}, any>{
    constructor(props: ICategory & IBaseComponentProps) {
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

const CategoryView = withComponent(Category);

interface ITokenViewState{
  order?: ITokenResponseItem | null;
  isLoading: boolean;
}

class TokenViewDetail extends Component<ITokenViewDetail & IBaseComponentProps, ITokenViewState, any> {
    public state:ITokenViewState = { order: null, isLoading: true };
    private readonly _refImage: React.RefObject<HTMLImageElement>;

    constructor(props: ITokenViewDetail & IBaseComponentProps) {
    super(props);

    this._refImage = React.createRef();
  }

  public componentDidMount() {
    this.props.nftContractContext.nft_token_get(this.tokenId).then(response => {
      console.log(`d response`, response);
      this.setState({...this.state, order: response, isLoading: false });
    });
  }

  private get tokenId() {
    return this.props.params.tokenId!;
  }

  public setDefaultImage = async () => {
    if(this._refImage.current){
      this._refImage.current.src = cardPreview;
    }
  }

  render(){
    if(this.state.isLoading){
      return <div className={`d-flex align-items-center flex-gap-36 p-5 ${styles.scrollWrap}`}>
        <div className="w-100"><Skeleton  count={1} height={300} /></div>
        <div className="w-100 flex-column"><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
      </div>
    }

    return (
      <div className={`d-flex flex-gap-36 container ${styles.mainWrap}`}>
          <div className={styles.cardImage}>
            <div className={styles.cardImageWrap}>
              <img ref={this._refImage} onError={this.setDefaultImage} className={styles.imageStyle} src={this.state.order?.metadata.media || cardPreview} alt={'preview image'}/>
              <div className={styles.cardDetail}>
                { (this.state.order?.metadata.expires_at !== '' && this.state.order?.metadata.expires_at !== null) && <div className={styles.daysInfo}>
                  {this.state.order?.metadata.expires_at}
                </div> }
              </div>
            </div>
          </div>
          <div className={styles.tokenInfo}>
            <div className={styles.titleWrap}>
              <div className={styles.titleInfo}>
                <h3>{this.state.order?.metadata.title}</h3>
                <div className={styles.avalialbeItems}>
                  <p className={styles.title}>Available items:</p>
                  <span className={styles.counts}>{1}/{2}</span>
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
              {this.state.order?.token_type && <CategoryView text={this.state.order?.token_type} />}
            </div>
            <div className={styles.creator}>
              <p className={styles.title}>Creator</p>
              <ArtistCard
                info={{
                  bio: '',
                  email: '',
                  image: '',
                  name: this.state.order?.owner_id!,
                  account_id: '',
                  likes_count: 0,
                  is_like: false,
                  is_following: false,
                  followers_count: 0
                }}
                identification={'0x0b9D2weq28asdqwe132'}
                usersCount={22}
                likesCount={12}
                isCard={false}
                isFollow={false}
                isLike={false}
              />
            </div>
            <div className={styles.tabsWrap}>
              <Tabs
                id="controlled-tab-example"
                className="mb-3"
              >
                <Tab eventKey="home" title="DESCRIPTION">
                    <div className={styles.tabContainer}>
                      <DescrtiptionView text={this.state.order?.metadata.description!}/>
                    </div>
                </Tab>
                <Tab eventKey="profile" title="DETAILS">
                  <div className={styles.tabContainer}>
                    <TokenDetailView address={'Contract Address'} id={this.state.order?.token_id!}/>
                  </div>
                </Tab>
                <Tab eventKey="bids" title="BIDS">
                  <div className={styles.tabContainer}>
                    <BidsView items={[{name: "user", identification: "28 September, 2021, 5:51 PM ", price: 12, currency: "ETC"},
                      {name: "user-2", identification: "2 September, 2021, 3:51 PM ", price: 2, currency: "ETC"}]}/>
                  </div>
                </Tab>
                <Tab eventKey="contact" title="HISTORY">
                  <div className={styles.tabContainer}>Empty result</div>
                </Tab>
                <Tab eventKey="owners" title="OWNERS">
                  <div className={styles.tabContainer}>Empty result</div>
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
