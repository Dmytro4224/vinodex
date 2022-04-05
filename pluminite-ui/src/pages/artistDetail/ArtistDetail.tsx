import React, { Component } from 'react';
import styles from './artistDetail.module.css';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { ICollectionResponseItem } from '../../types/ICollectionResponseItem';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import collectionCover from '../../assets/images/collection-head-bg.jpg';
import defaultImage from '../../assets/images/vine-def.png';
import { Tab, Tabs } from 'react-bootstrap';
import { ProfileTokensType } from '../../types/ProfileTokenTypes';
import ProfileTokensView from '../../components/profile/profileTokensView/ProfileTokensView';
import { convertYoctoNearsToNears } from '../../utils/sys';

interface IArtistDetail extends IProps { }
interface IArtistDetailState {
  tokens: Array<ITokenResponseItem>;
  artistData: any;
  statistic: any;
  isLoading: boolean;
}

class ArtistDetail extends Component<IArtistDetail & IBaseComponentProps> {
  public state: IArtistDetailState = {
    tokens: new Array<ITokenResponseItem>(),
    artistData: null,
    isLoading: true,
    statistic: null
  };

  constructor(props: IArtistDetail & IBaseComponentProps) {
    super(props);
  }

  private get getUserId() {
    return this.props.params.id!;
  }

  public componentDidMount() {
    window.scroll(0, 0);

    this.props.nftContractContext.profile_get_stat(this.getUserId).then(stat => {
      this.setState({
        ...this.state,
        statistic: stat,
        isLoading: false
      })
    });

    this.props.nftContractContext.getProfile(this.getUserId).then(profile => {
      if (profile) {
        this.setState({
          ...this.state,
          artistData: profile
        })
      }
    });
  }

  public componentDidUpdate(prevProps, prevState) {
    if (
      !this.state.artistData?.is_viewed &&
      this.state.artistData !== null &&
      this.getUserId &&
      this.props.near.isAuth &&
      this.props.near.user?.accountId !== this.getUserId
    ) {
      this.props.nftContractContext.view_artist_account(this.getUserId);
    }
  }

  private get coverImage() {
    return this.state.artistData?.cover_image || collectionCover;
  }

  private get image() {
    return this.state.artistData?.image || defaultImage;
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

  private getPrice(price: string | number) {
    return convertYoctoNearsToNears(price) || 0.00;
  }

  private get floorPrice() {
    return this.getPrice(this.state.statistic?.prices_as_artist?.sold?.lowest_price || 0);
  }

  private get itemsCount() {
    return this.state.statistic?.tokens_count_as_artist || 0
  }

  private get latestPrice() {
    return this.getPrice(this.state.statistic?.prices_as_artist?.sold?.newest_price || 0);
  }

  private get volumeTraded() {
    return this.getPrice(this.state.statistic?.prices_as_artist?.sold?.total_price || 0)
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
          <h4 className={styles.name}>{this.state.artistData?.name || ''}</h4>

          <div className={`breadcrumb breadcrumb-black mt-2 mb-5 ${styles.breadcrumb}`}>
            <NavLink to={'/'}>Home</NavLink>
            <span className='breadcrumb__separator'>/</span>
            <NavLink to={'/artists'}>Artists</NavLink>
            <span className='breadcrumb__separator'>/</span>
            <p>{this.state.artistData?.name || this.state.artistData?.account_id || ''}</p>
          </div>

          <p className={styles.description}>{this.state.artistData?.bio || ''}</p>

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
            <div className={`d-flex align-items-center flex-gap-36 flex-wrap`}>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            </div>
          ) : this.itemsCount > 0 ? (
            <Tabs
              id='controlled-tab'
              className='mb-3 justify-content-center tab-custom'
            >
              <Tab eventKey='items' title='Items'>
                <ProfileTokensView
                  catalog={'Wine'}
                  sort={7}
                  typeViewTokens={ProfileTokensType.owner}
                />
              </Tab>
              <Tab eventKey='sale' title='On sale'>
                <ProfileTokensView
                  catalog={'Wine'}
                  sort={7}
                  typeViewTokens={ProfileTokensType.onSale}
                />
              </Tab>
              <Tab eventKey='creator' title='Creator'>
                <ProfileTokensView
                  catalog={'Wine'}
                  sort={7}
                  typeViewTokens={ProfileTokensType.creator}
                />
              </Tab>
              <Tab eventKey='artist' title='Artist'>
                <ProfileTokensView
                  catalog={'Wine'}
                  sort={7}
                  typeViewTokens={ProfileTokensType.artist}
                />
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

export default withComponent(ArtistDetail);
