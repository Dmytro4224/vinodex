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

interface ICollectionDetailPage extends IProps { }
interface ICollectionDetailPageState {
  tokens: Array<ITokenResponseItem>;
  collectionData: ICollectionResponseItem | null;
  isLoading: boolean;
}

class CollectionDetailPage extends Component<ICollectionDetailPage & IBaseComponentProps> {
  public state: ICollectionDetailPageState = {
    tokens: new Array<ITokenResponseItem>(),
    collectionData: null,
    isLoading: true
  };

  constructor(props: ICollectionDetailPage & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    window.scroll(0, 0);
    this.getCollectionInfo();
  }

  private getCollectionInfo() {
    this.setState({
      ...this.state,
      isLoading: false,
    })

    this.props.nftContractContext.collection_get(
      this.props.params.id!,
      this.props.near.user?.accountId || null,
      true
    ).then(res => {
      console.log('collection_get res', res);
      this.setState({
        ...this.state,
        isLoading: false,
        collectionData: res
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
            <div>
              <p className={styles.informerTitle}>0 Ⓝ</p>
              <p className={styles.informerDesc}>Floor Price</p>
            </div>
            <div>
              <p className={styles.informerTitle}>{this.state.collectionData?.tokens_count}</p>
              <p className={styles.informerDesc}>Items</p>
            </div>
            <div>
              <p className={styles.informerTitle}>0 Ⓝ</p>
              <p className={styles.informerDesc}>Latest Price</p>
            </div>
            <div>
              <p className={styles.informerTitle}>0 Ⓝ</p>
              <p className={styles.informerDesc}>Volume traded</p>
            </div>
          </div>

          <Tabs
            id='controlled-tab'
            className='mb-3 justify-content-center tab-custom'
          >
            <Tab eventKey='items' title='Items'>
              {this.state.isLoading ? (
                <div className='d-flex w-100 align-items-center flex-gap-36 my-4 flex-wrap-500px'>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                </div>
              ) : !this.state.tokens.length ? (
                <div className='w-100 my-5 d-flex align-items-center justify-content-center flex-column'>
                  <EmptyListView />
                </div>
              ) : (
                <div className={`${styles.listWrap}`}>

                </div>
              )}
            </Tab>
            <Tab eventKey='sale' title='On sale'>
              {this.state.isLoading ? (
                <div className='d-flex w-100 align-items-center flex-gap-36 my-4 flex-wrap-500px'>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                  <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
                </div>
              ) : !this.state.tokens.length ? (
                <div className='w-100 my-5 d-flex align-items-center justify-content-center flex-column'>
                  <EmptyListView />
                </div>
              ) : (
                <div className={`${styles.listWrap}`}>

                </div>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default withComponent(CollectionDetailPage);
