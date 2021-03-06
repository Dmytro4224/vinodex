import React, { Component } from 'react';
import styles from './сollectionDetailPage.module.css';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { ICollectionResponseItem } from '../../types/ICollectionResponseItem';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import collectionCover from '../../assets/images/collection-head-bg.jpg';
import defaultImage from '../../assets/images/vine-def.png';
import { Tab, Tabs } from 'react-bootstrap';
import TokenCardView from '../../components/tokenCard/tokenCardView';
import { convertYoctoNearsToNears, mediaUrl, uid } from '../../utils/sys';

interface ICollectionDetailPage extends IProps { }
interface ICollectionDetailPageState {
  tokens: Array<ITokenResponseItem>;
  collectionData: ICollectionResponseItem | null;
  isLoading: boolean;
  statistic: any;
}

class CollectionDetailPage extends Component<ICollectionDetailPage & IBaseComponentProps> {
  public state: ICollectionDetailPageState = {
    tokens: new Array<ITokenResponseItem>(),
    collectionData: null,
    isLoading: true,
    statistic: null
  };

  constructor(props: ICollectionDetailPage & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    window.scroll(0, 0);
    this.getCollectionInfo();
    this.getStat();

    if (this.state.collectionData && !this.state.collectionData?.is_viewed && this.props.near.isAuth) {
      this.props.nftContractContext.collection_set_view(this.props.params.id!);
    }
  }

  private getStat() {
    this.props.nftContractContext.collection_get_stat(this.props.params.id!).then(stat => {
      this.setState({
        ...this.state,
        statistic: stat
      })
    });
  }

  private getCollectionInfo() {
    this.props.nftContractContext.collection_get(
      this.props.params.id!,
      this.props.near.user?.accountId || null,
      true
    ).then(res => {
      this.setState({
        ...this.state,
        isLoading: false,
        collectionData: res,
        tokens: res.tokens
      })
    })
  }

  private get description() {
    return this.state.collectionData?.description || '';
  }

  private get coverImage() {
    return this.state.collectionData?.cover_photo || collectionCover;
  }

  private get image() {
    return this.state.collectionData?.profile_photo || defaultImage;
  }

  private get collectionName() {
    return this.state.collectionData?.name ||  'Collection name';
  }

  private onErrorImage(type: string, target: any) {
    switch (type) {
      case 'cover':
        target.src = collectionCover;
        break;
      case 'logo':
        target.src = defaultImage;
        break;
    }
  }

  private getTabData(type?: string) {
    let tokens = this.state.tokens;

    if (type === 'sale') {
      tokens = tokens.filter(token => token.sale !== null)
    }

    return (
      !tokens.length ? (
        <div className='w-100 my-5 d-flex align-items-center justify-content-center flex-column'>
          <EmptyListView />
        </div>
      ) : (
        <div className={`${styles.listWrap}`}>
          {tokens.map(item => (
            <TokenCardView
              key={`catalog-token-${item.token_id}-${uid()}`}
              model={item}
              countL={1}
              countR={1}
              days={item.metadata.expires_at}
              name={item.metadata.title}
              author={item.owner_id}
              likesCount={item.metadata.likes_count}
              icon={mediaUrl(item.metadata)}
              isSmall={true}
              buttonText={`Place a bid`}
              linkTo={`/token/${item.token_id}`}
              tokenID={item.token_id}
              isLike={item.is_liked}
              onClick={() => {}}
              isForceVisible={true}
            />
          ))}
        </div>
      )
    )
  }

  private getPrice(price: string | number) {
    return convertYoctoNearsToNears(price) || 0.00;
  }

  private get floorPrice() {
    return this.getPrice(this.state.statistic?.prices?.sold?.lowest_price || 0);
  }

  private get itemsCount() {
    return this.state.statistic?.tokens_count || 0
  }

  private get latestPrice() {
    return this.getPrice(this.state.statistic?.prices?.sold?.newest_price || 0);
  }

  private get volumeTraded() {
    return this.getPrice(this.state.statistic?.prices?.sold?.total_price || 0)
  }

  public render() {
    return (
      <div>
        <div className={styles.header}>
          <div
            style={{ backgroundImage: `url(${this.coverImage})` }}
            className={styles.cover}
          />
          <div className={styles.logoWrap}>
            <img
              onError={(e) => { this.onErrorImage('logo', e.target) }}
              className={styles.logo} src={this.image} alt='img' />
          </div>
        </div>

        <div className={`container ${styles.infoWrap}`}>
          <h4 className={styles.name}>{this.collectionName}</h4>

          <div className={`breadcrumb breadcrumb-black mt-2 mb-5 ${styles.breadcrumb}`}>
            <NavLink to={'/'}>Home</NavLink>
            <span className='breadcrumb__separator'>/</span>
            <NavLink to={'/collections'}>Collections</NavLink>
            <span className='breadcrumb__separator'>/</span>
            <p>{this.collectionName}</p>
          </div>

          <p className={styles.description}>{this.description}</p>

          <div className={styles.informer}>
            <div className={this.floorPrice > 0 ? '' : 'disabled'}>
              <p className={styles.informerTitle}>{this.floorPrice}&nbsp;Ⓝ</p>
              <p className={styles.informerDesc}>Floor Price</p>
            </div>
            <div className={this.itemsCount > 0 ? '' : 'disabled'}>
              <p className={styles.informerTitle}>{this.itemsCount}</p>
              <p className={styles.informerDesc}>Items</p>
            </div>
            <div className={this.latestPrice > 0 ? '' : 'disabled'}>
              <p className={styles.informerTitle}>{this.latestPrice}&nbsp;Ⓝ</p>
              <p className={styles.informerDesc}>Latest Price</p>
            </div>
            <div className={this.volumeTraded > 0 ? '' : 'disabled'}>
              <p className={styles.informerTitle}>{this.volumeTraded}&nbsp;Ⓝ</p>
              <p className={styles.informerDesc}>Volume traded</p>
            </div>
          </div>

          {this.state.isLoading ? (
            <div className='d-flex w-100 align-items-center flex-gap-36 my-4 flex-wrap-500px'>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            </div>
          ) : this.state.tokens.length > 0 ? (
            <Tabs
              id='controlled-tab'
              className='mb-3 justify-content-center tab-custom'
            >
              <Tab eventKey='items' title='Items'>
                {this.getTabData()}
              </Tab>
              <Tab eventKey='sale' title='On sale'>
                {this.getTabData('sale')}
              </Tab>
            </Tabs>
          ) : (
            <>
              <p className='line-separator my-4' />
              <EmptyListView />
            </>
          )}
        </div>
      </div>
    )
  }
}

export default withComponent(CollectionDetailPage);
