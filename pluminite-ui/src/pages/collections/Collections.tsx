import { Component } from 'react';
import styles from './collections.module.css';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { ICollectionResponseItem } from '../../types/ICollectionResponseItem';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import { uid } from '../../utils/sys';
import CollectionCard, { CollectionType } from '../../components/collections/collectionCard/CollectionCard';

interface ICollectionsPage extends IProps { }
interface ICollectionPageState {
  collections: Array<ICollectionResponseItem>;
  isLoading: boolean;
}

class CollectionsPage extends Component<ICollectionsPage & IBaseComponentProps> {
  public state: ICollectionPageState = {
    collections: new Array<ICollectionResponseItem>(),
    isLoading: true
  };

  constructor(props: ICollectionsPage & IBaseComponentProps) {
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

    const user = this.props.near.user?.accountId || null;

    this.props.nftContractContext.nft_collections(
      1,
      100,
      user,
      true
    ).then(res => {
      this.setState({
        ...this.state,
        isLoading: false,
        collections: res
      })
    })
  }

  public render() {
    return (
      <div>
        <div className={styles.header}>
          <div className={`container ${styles.headerInfo}`}>
            <h4 className={styles.title}>Collections</h4>
            <div className='breadcrumb'>
              <NavLink to={'/'}>Home</NavLink>
              <span className='breadcrumb__separator'>/</span>
              <p>Collections</p>
            </div>
          </div>
        </div>
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
            <div className={`container ${styles.listWrap}`}>
              {this.state.collections.map(data => (
                <CollectionCard
                  key={uid()}
                  data={data}
                  type={CollectionType.big}
                />
              ))}
            </div>
          )}
      </div>
    )
  }
}

export default withComponent(CollectionsPage);
