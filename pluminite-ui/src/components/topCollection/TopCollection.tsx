import { Component } from 'react';
import styles from './collections.module.css';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { ICollectionResponseItem } from '../../types/ICollectionResponseItem';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';
import Skeleton from 'react-loading-skeleton';
import CollectionCard, { CollectionType } from '../../components/collections/collectionCard/CollectionCard';
import LabelView from '../common/label/labelView';
import ButtonView, { buttonColors } from '../common/button/ButtonView';

interface ITopCollection extends IProps { }
interface ITopCollectionState {
  collections: Array<ICollectionResponseItem>;
  isLoading: boolean;
}

class TopCollection extends Component<ITopCollection & IBaseComponentProps> {
  public state: ITopCollectionState = {
    collections: new Array<ICollectionResponseItem>(),
    isLoading: true
  };

  constructor(props: ITopCollection & IBaseComponentProps) {
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
      2,
      user,
      true,
      null
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
        <div className='d-flex align-items-center justify-content-between my-3 flex-wrap'>
          <LabelView text={'TOP COLLECTIONS'} />
          <ButtonView
            text={'Explore more'}
            customClass={'btn-explore-more'}
            onClick={() => {
              this.props.navigate('/collections');
            }}
            color={buttonColors.gold}
          />
        </div>
        <div className={`d-flex flex-gap-36 ${styles.scrollWrap}`}>
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
                  key={data.collection_id}
                  data={data}
                  type={CollectionType.big}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default withComponent(TopCollection);
