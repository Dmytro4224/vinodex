import React, { Component } from 'react';
import styles from './collections.module.css';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { ICollectionResponseItem } from '../../types/ICollectionResponseItem';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import CollectionCard, { CollectionType } from '../../components/collections/collectionCard/CollectionCard';
import bgHead from '../../assets/images/collection-head-bg.jpg';
import { MainLogoView } from '../../components/mainLogo/mainLogoView';
import ButtonView, { buttonColors } from '../../components/common/button/ButtonView';

interface ICollectionsPage extends IProps { }
interface ICollectionPageState {
  collections: Array<ICollectionResponseItem>;
  isLoading: boolean;
  isShowLoadMore: boolean;
  isBtnLoading: boolean;
}

class CollectionsPage extends Component<ICollectionsPage & IBaseComponentProps> {
  private _pageSize: number = 50;

  public state: ICollectionPageState = {
    collections: new Array<ICollectionResponseItem>(),
    isLoading: true,
    isShowLoadMore: false,
    isBtnLoading: false,
  };

  constructor(props: ICollectionsPage & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    window.scroll(0,0);
    this.getList()
  }

  private getList() {
    this.setState({
      ...this.state,
      isBtnLoading: true,
    })

    const user = this.props.near.user?.accountId || null;

    this.props.nftContractContext.nft_collections(
      1,
      this._pageSize,
      user,
      true,
      null
    ).then(res => {
      let isShowLoadMore = true;

      if (res.length === this.state.collections.length || res.length !== this._pageSize) {
        isShowLoadMore = false;
      }

      this.setState({
        ...this.state,
        isLoading: false,
        isBtnLoading: false,
        isShowLoadMore,
        collections: res
      })
    })
  }

  public render() {
    return (
      <div>
        <MainLogoView
          img={bgHead}
          title={'Collections'}
          bgWrap={'#807F68'}
          bgHeadInfo={'#5E4C1A'}
          breadcrumbs={
            <>
              <NavLink to={'/'}>Home</NavLink>
              <span className='breadcrumb__separator'>/</span>
              <p>Collections</p>
            </>
          }
        />

          {this.state.isLoading ? (
            <div className='d-flex w-100 align-items-center flex-gap-36 my-4 flex-wrap-500px container'>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
              <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            </div>
          ) : !this.state.collections.length ? (
            <div className='w-100 my-5 d-flex align-items-center justify-content-center flex-column container'>
              <EmptyListView />
            </div>
          ) : (
            <>
              <div className={`container my-4 ${styles.listWrap}`}>
                {this.state.collections.map(data => (
                  <CollectionCard
                    key={data.collection_id}
                    data={data}
                    type={CollectionType.big}
                  />
                ))}
              </div>

              {this.state.isShowLoadMore && (
                <ButtonView
                  text={'Load more'}
                  onClick={() => { this._pageSize *= 2; this.getList() }}
                  color={buttonColors.goldBordered}
                  customClass={`min-w-100px m-0-a py-2 my-5 d-block`}
                  isLoading={this.state.isBtnLoading}
                />
              )}
            </>
          )}
      </div>
    )
  }
}

export default withComponent(CollectionsPage);
