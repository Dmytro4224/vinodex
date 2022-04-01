import { Component } from 'react';
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
  public state = {
    collections: new Array<ICollectionResponseItem>(),
    isLoading: true
  }

  constructor(props: ICollectionList & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.getList()
  }

  private getList() {
    this.setState({
      ...this.state,
      isLoading: true,
    })

    const user = this.props.params.userId || this.props.near.user?.accountId || null;
    
    this.props.nftContractContext.nft_collections(
      1,
      100,
      user,
      true,
      this.props.collectionOwner || null
    ).then(res => {
      this.setState({
        ...this.state,
        isLoading: false,
        collections: res
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
    )
  }
}

export default withComponent(CollectionList)
