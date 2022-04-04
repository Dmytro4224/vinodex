import { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import { TokensSortType } from '../../types/TokensSortType';
import { convertNearToYoctoString, mediaUrl } from '../../utils/sys';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import { EmptyListView } from '../common/emptyList/emptyListView';
import LabelView from '../common/label/labelView';
import Loader from '../common/loader/loader';
import TokenCardView from '../tokenCard/tokenCardView';
import styles from './allTokensInCatalogView.module.css';

interface IAllTokensInCatalogView extends IProps {
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: TokensSortType;
  priceFrom?: number | string | null;
  priceTo?: number | string | null;
  type?: boolean | null;
}

class AllTokensInCatalogView extends Component<IAllTokensInCatalogView & IBaseComponentProps> {
  public state = { list: new Array<ITokenResponseItem>(), isLoading: true };

  constructor(props: IAllTokensInCatalogView & IBaseComponentProps) {
    super(props);
  }

  private get sort() {
    return this.props.sort || TokensSortType.Most_viewed;
  }

  public componentDidMount() {
    window.scrollTo(0, 0);
    this.loadData();
  }

  public componentDidUpdate(prevProps: IAllTokensInCatalogView, prevState: any) {
    if (
      prevProps.catalog !== this.props.catalog ||
      prevProps.sort !== this.props.sort ||
      prevProps.priceFrom !== this.props.priceFrom ||
      prevProps.priceTo !== this.props.priceTo ||
      prevProps.type !== this.props.type
    ) {
      this.loadData();
    }
  }

  private get priceFrom() {
    if (!this.props.priceFrom) return null;

    return convertNearToYoctoString(Number(this.props.priceFrom));
  }

  private get priceTo() {
    if (!this.props.priceTo) return null;

    return convertNearToYoctoString(Number(this.props.priceTo));
  }

  private async loadData() {
    this.props.nftContractContext.nft_tokens_by_filter({
      catalog: this.props.catalog,
      page_index: 1,
      page_size: 1000,
      sort: this.sort,
      price_from: this.priceFrom,
      price_to: this.priceTo,
      is_single: typeof this.props.type === 'undefined' ? null : this.props.type,
    }).then(response => {
      this.setState({ ...this.state, list: response, isLoading: false });
    });
  }

  public render() {
    if (this.state.isLoading) {
      return <div className={`d-flex align-items-center flex-gap-36 flex-wrap ${styles.scrollWrap}`}>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
      </div>;
    }

    if (!this.state.list.length) {
      return <EmptyListView />;
    }

    return <div>
      <div className={`d-flex flex-gap-36 flex-wrap ${styles.scrollWrap}`}>
        {this.state.list.map(item => {
          return <TokenCardView
            key={`alltokensincatalog-${item.token_id}`}
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
            customClass={styles.tokenWidth}
            onClick={() => {
              //this.props.navigate('/token/qwewqq-1231-weq-123');
            }} />;
        })}
      </div>
    </div>;
  }
}

export default withComponent(AllTokensInCatalogView);
