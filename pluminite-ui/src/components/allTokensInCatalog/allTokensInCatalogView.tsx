import React, { Component } from 'react';
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
import { IFilterOptions } from '../../types/IFilterOptions';

interface IAllTokensInCatalogView extends IProps {
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: TokensSortType;
  filterOptions: IFilterOptions | null;
}

class AllTokensInCatalogView extends Component<IAllTokensInCatalogView & IBaseComponentProps> {
  private _pageSize: number = 50;

  public state = {
    list: new Array<ITokenResponseItem>(),
    isLoading: true,
    isShowLoadMore: true,
    isBtnLoading: false
  };

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

  private async loadData() {
    this.setState({ ...this.state, isBtnLoading: true })

    this.props.nftContractContext.nft_tokens_by_filter({
      catalog: this.props.catalog,
      page_index: 1,
      page_size: this._pageSize,
      sort: this.sort,
      price_from: this.priceFrom,
      price_to: this.priceTo,
      is_single: typeof this.props.filterOptions?.type === 'undefined' ? null : this.props.filterOptions.type,
      year: this.props.filterOptions?.year,
      style: this.props.filterOptions?.style,
      brand: this.props.filterOptions?.brand,
      bottle_size: this.props.filterOptions?.bottle_size
    }).then(response => {
      let isShowLoadMore = true;

      if (response.length === this.state.list.length || response.length !== this._pageSize) {
        isShowLoadMore = false;
      }

      this.setState({
        ...this.state,
        list: response,
        isLoading: false,
        isBtnLoading: false,
        isShowLoadMore
      });
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

    return (
      <div>
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

        {this.state.isShowLoadMore && (
          <ButtonView
            text={'Load more'}
            onClick={() => { this._pageSize *= 2; this.loadData() }}
            color={buttonColors.goldBordered}
            customClass={`min-w-100px m-0-a py-2 my-5 d-block`}
            isLoading={this.state.isBtnLoading}
          />
        )}
      </div>
    )
  }
}

export default withComponent(AllTokensInCatalogView);
