import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import CollectionCard from '../collectionCard/CollectionCard';
import styles from './collectionList.module.css';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { RenderType } from '../Collections';
import { ICollectionResponseItem } from '../../../types/ICollectionResponseItem';
import Skeleton from 'react-loading-skeleton';
import { uid } from '../../../utils/sys';
import { EmptyListView } from '../../common/emptyList/emptyListView';

interface ICollectionList extends IProps {
  changeRenderType?: (type: RenderType, data?: ICollectionResponseItem | null) => void;
  collectionOwner?: string | null;
}

class CollectionList extends Component<ICollectionList & IBaseComponentProps> {
  private _pageSize: number = 50;

  public state = {
    collections: new Array<ICollectionResponseItem>(),
    isLoading: true,
    isShowLoadMore: false,
    isBtnLoading: false,
  }

  constructor(props: ICollectionList & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.getList()
  }

  private getList() {
    const user = this.props.params.userId || this.props.near.user?.accountId || null;

    this.setState({
      ...this.state,
      isBtnLoading: true,
    })

    this.props.nftContractContext.nft_collections(
      1,
      this._pageSize,
      user,
      true,
      this.props.collectionOwner || null
    ).then(res => {
      let isShowLoadMore = true;

      if (res.length === this.state.collections.length || res.length !== this._pageSize) {
        isShowLoadMore = false;
      }

      this.setState({
        ...this.state,
        isLoading: false,
        collections: res,
        isShowLoadMore,
        isBtnLoading: false,
      })
    })
  }

  private changeRenderType(type: RenderType, data?: ICollectionResponseItem | null) {
    if (!this.props.near.isAuth) {
      this.props.near.signIn();
    }

    this.props.changeRenderType && this.props.changeRenderType(type, data);
  }

  private get createAction() {
    if (this.props.params.userId !== this.props.near.user?.accountId) {
      return (
        <>
          <EmptyListView />
        </>
      )
    }

    return (
      <>
        <p className={styles.titleCreate}>Create a new collection of tokens</p>

        <ButtonView
          text={'CREATE COLLECTION'}
          onClick={() => { this.changeRenderType(RenderType.createCollection) }}
          color={buttonColors.goldFill}
          customClass={`ml-10px min-w-100px`}
        />
      </>
    )
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <div className='d-flex align-items-center flex-gap-36 my-4 flex-wrap-500px'>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        </div>
      )
    }

    if (!this.state.collections.length) {
      return (
        <div className='w-100 my-5 d-flex align-items-center justify-content-center flex-column'>
          {this.createAction}
        </div>
      )
    }

    return (
      <>
        <div className={styles.listWrap}>
          {this.props.params.userId === this.props.near.user?.accountId && (
            <div className={styles.createCollectionCard}>
              {this.createAction}
            </div>
          )}

          {this.state.collections.map(data => (
            <CollectionCard
              key={data.collection_id}
              data={data}
              changeRenderType={(type: RenderType, data?: ICollectionResponseItem | null) => this.changeRenderType(type, data)}
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
    )
  }
}

export default withComponent(CollectionList)
