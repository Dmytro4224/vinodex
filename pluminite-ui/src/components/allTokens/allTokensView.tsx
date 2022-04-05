import { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import { convertNearToYoctoString, mediaUrl } from '../../utils/sys';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import { EmptyListView } from '../common/emptyList/emptyListView';
import LabelView from '../common/label/labelView';
import TokenCardView from '../tokenCard/tokenCardView';
import styles from './allTokens.module.css';
import { IFilterOptions } from '../../types/IFilterOptions';

interface IAllTokensView extends IProps {
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: number;
  filterOptions: IFilterOptions | null;
}

class AllTokensView extends Component<IAllTokensView & IBaseComponentProps> {
  public state = {
    list: new Array<ITokenResponseItem>(),
    isLoading: true
  };

  constructor(props: IAllTokensView & IBaseComponentProps) {
    super(props);
  }

  private get sort() {
    return this.props.sort || 7;
  }

  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps: IAllTokensView, prevState: any) {
    if (
      prevProps.catalog !== this.props.catalog ||
      prevProps.sort !== this.props.sort ||
      prevProps.filterOptions?.priceFrom !== this.props.filterOptions?.priceFrom ||
      prevProps.filterOptions?.priceTo !== this.props.filterOptions?.priceTo ||
      prevProps.filterOptions?.year !== this.props.filterOptions?.year ||
      prevProps.filterOptions?.style !== this.props.filterOptions?.style ||
      prevProps.filterOptions?.brand !== this.props.filterOptions?.brand ||
      prevProps.filterOptions?.bottle_size !== this.props.filterOptions?.bottle_size
    ) {
      this.loadData();
    }
  }

  private get priceFrom() {
    if (!this.props.filterOptions?.priceFrom) return null;

    return convertNearToYoctoString(Number(this.props.filterOptions.priceFrom));
  }

  private get priceTo() {
    if (!this.props.filterOptions?.priceTo) return null;

    return convertNearToYoctoString(Number(this.props.filterOptions.priceTo));
  }

  private loadData() {
    this.props.nftContractContext.nft_tokens_by_filter({
      catalog: null,
      page_index: 1,
      page_size: 4,
      sort: this.sort,
      price_from: this.priceFrom,
      price_to: this.priceTo,
      is_single: typeof this.props.filterOptions?.type === 'undefined' ? null : this.props.filterOptions.type,
      year: this.props.filterOptions?.year,
      style: this.props.filterOptions?.style,
      brand: this.props.filterOptions?.brand,
      bottle_size: this.props.filterOptions?.bottle_size
    }).then(response => {
      this.setState({ ...this.state, list: response, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <div className='d-flex align-items-center flex-gap-36'>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
      </div>;
    }

    if (!this.state.list.length) {
      return (
        <>
          <LabelView text={'All'} />
          <EmptyListView />
        </>
      );
    }

    return <div>
      <div className='d-flex align-items-center justify-content-between my-3 flex-wrap'>
        <LabelView text={'All'} />
        <ButtonView
          text={'Explore more'}
          customClass={'btn-explore-more'}
          onClick={() => {
            this.props.navigate('/tokens/3');
          }}
          color={buttonColors.gold}
        />
      </div>
      <div className={`d-flex flex-gap-36 ${styles.scrollWrap}`}>
        {this.state.list.map(item => {
          return <TokenCardView
            key={`alltokens-${item.token_id}`}
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
            onClick={() => {
            }} />;
        })}
      </div>
    </div>;
  }
}

export default withComponent(AllTokensView);
