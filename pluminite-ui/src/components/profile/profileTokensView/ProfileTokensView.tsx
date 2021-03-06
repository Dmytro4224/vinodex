import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { EmptyListView } from '../../common/emptyList/emptyListView';
import TokenCardView from '../../tokenCard/tokenCardView';
import styles from './profileTokensView.module.css';
import { dropdownColors, DropdownView } from '../../common/dropdown/dropdownView';
import { dropdownData } from '../../common/dropdown/data';
import TabsFilterView from '../../tabsFilterView/tabsFilterView';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { ProfileTokensType } from '../../../types/ProfileTokenTypes';
import MediaQuery from 'react-responsive';
import sortIcon from '../../../assets/icons/sort-icon.svg';
import filterIcon from '../../../assets/icons/filter-icon.svg';
import { convertNearToYoctoString, mediaUrl, uid } from '../../../utils/sys';
import { TokensType } from '../../../types/TokenTypes';
import CatalogFilterView from '../../catalogFilterView/CatalogFilterView';
import { IFilterOptions } from '../../../types/IFilterOptions';

interface IProfileTokensView extends IProps {
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: number;
  typeViewTokens?: ProfileTokensType;
}

type ProfileTokensViewTypes = {
  filterOptions: IFilterOptions | null
  currentCatalog: number,
  isLoading: boolean,
  catalog: any,
  sort: number,
  list: any,
  isShowLoadMore: boolean,
  isBtnLoading: boolean,
}

class ProfileTokensView extends Component<IProfileTokensView & IBaseComponentProps> {
  private _pageSize: number = 50;

  public state: ProfileTokensViewTypes = {
    list: new Array<ITokenResponseItem>(),
    sort: 7,
    currentCatalog: -1,
    catalog: this.props.near.catalogs[0],
    isLoading: true,
    filterOptions: null,
    isShowLoadMore: false,
    isBtnLoading: false,
  };

  private _catalogFilterView: any;
  private _typeViewParams = {
    [ProfileTokensType.onSale]: { owner_id: this.urlUserId, is_for_sale: true, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.activeBids]: { is_active_bid: true, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.favourites]: { is_liked: true, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.creator]: { creator_id: this.urlUserId, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.creatorOnSale]: { creator_id: this.urlUserId, is_for_sale: true, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.artist]: { artist_id: this.urlUserId, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.artistOnSale]: { artist_id: this.urlUserId, is_for_sale: true, price_from: this.priceFrom, price_to: this.priceTo },
    [ProfileTokensType.owner]: { owner_id: this.urlUserId, price_from: this.priceFrom, price_to: this.priceTo },
  };

  constructor(props: IProfileTokensView & IBaseComponentProps) {
    super(props);

    this._catalogFilterView = React.createRef();
  }

  private get urlUserId() {
    return this.props.params.id || this.props.params.userId || null;
  }

  private setFilter(filterOptions: IFilterOptions) {
    this.setState({ ...this.state, filterOptions })
  }

  private onFilterClick = async (e: React.MouseEvent<Element>) => {
    e.preventDefault();
    this._catalogFilterView.toogle();
  }

  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps, prevState) {
    if (
      prevState.sort !== this.sort ||
      prevState.filterOptions?.priceFrom !== this.state.filterOptions?.priceFrom ||
      prevState.filterOptions?.priceTo !== this.state.filterOptions?.priceTo ||
      prevState.filterOptions?.year !== this.state.filterOptions?.year ||
      prevState.filterOptions?.type !== this.state.filterOptions?.type ||
      prevState.filterOptions?.style !== this.state.filterOptions?.style ||
      prevState.filterOptions?.brand !== this.state.filterOptions?.brand ||
      prevState.filterOptions?.bottle_size !== this.state.filterOptions?.bottle_size
    ) {
      this.loadData();
    }
  }

  private get priceFrom() {
    if (!this.state.filterOptions?.priceFrom) return null;

    return convertNearToYoctoString(Number(this.state.filterOptions.priceFrom));
  }

  private get priceTo() {
    if (!this.state.filterOptions?.priceTo) return null;

    return convertNearToYoctoString(Number(this.state.filterOptions.priceTo));
  }

  private loadData() {
    const data = { ...this._typeViewParams[this.typeViewTokens || ProfileTokensType.owner] };

    this.props.nftContractContext.nft_tokens_by_filter({
      catalog: this.props.catalog,
      page_index: 1,
      page_size: this._pageSize,
      sort: this.sort || 7,
      ...data,
      is_single: typeof this.state.filterOptions?.type === 'undefined' ? null : this.state.filterOptions.type,
      year: this.state.filterOptions?.year,
      style: this.state.filterOptions?.style,
      brand: this.state.filterOptions?.brand,
      bottle_size: this.state.filterOptions?.bottle_size
    }).then(response => {
      let isShowLoadMore = true;

      if (response.length === this.state.list.length || response.length !== this._pageSize) {
        isShowLoadMore = false;
      }

      this.setState({
        ...this.state,
        list: response,
        isLoading: false,
        catalog: this.catalog,
        sort: this.sort,
        isShowLoadMore,
        isBtnLoading: false,
      });
    }).catch(ex => {
      console.error('loadData ex => ', ex);
    });
  }

  private get sort() {
    return this.props.sort || 7;
  }

  private get catalog() {
    return this.props.near.catalogs[this.state.currentCatalog];
  }

  private get typeViewTokens() {
    return this.props.typeViewTokens;
  }


  private setCatalog(catalog: number) {
    this.setState({ ...this.state, currentCatalog: catalog });
  }

  private setSort(sort: number) {
    this.setState({ ...this.state, sort: sort });
  }

  private getFilter() {
    return (
      <div className={'mt-2'}>
        <MediaQuery minWidth={992}>
          <div className={`d-flex align-items-center justify-content-between my-4 ${styles.filterWrap}`}>
            <DropdownView
              colorType={dropdownColors.selectFilter}
              title={'Sort by'}
              onChange={(item) => {
                this.setSort(item.id);
              }}
              childrens={dropdownData}
            />

            {/*<TabsFilterView*/}
            {/*  currentTabIndex={this.state.currentCatalog}*/}
            {/*  onClick={(index) => {*/}
            {/*    this.setCatalog(index);*/}
            {/*  }}*/}
            {/*/>*/}

            <ButtonView
              text={'Filter'}
              onClick={this.onFilterClick}
              color={buttonColors.select}
              customClass={'btn-filter'}
            />
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={991}>
          <div className='d-flex flex-column w-100'>
            <div className='d-flex align-items-center justify-content-between'>
              <DropdownView
                colorType={dropdownColors.select}
                title={''}
                icon={sortIcon}
                hideArrow={true}
                onChange={(item) => {
                  this.setSort(item.id);
                }}
                childrens={dropdownData}
              />

              <ButtonView
                text={''}
                withoutText={true}
                icon={filterIcon}
                onClick={this.onFilterClick}
                color={buttonColors.select}
              />
            </div>
            {/*<div className={`d-flex align-items-center mt-4 ${styles.filterWrap}`}>*/}
            {/*  <TabsFilterView*/}
            {/*    currentTabIndex={this.state.currentCatalog}*/}
            {/*    onClick={(index) => {*/}
            {/*      this.setCatalog(index);*/}
            {/*    }}*/}
            {/*  />*/}
            {/*</div>*/}
          </div>
        </MediaQuery>

        <CatalogFilterView
          setFilter={(filterOptions: IFilterOptions) => this.setFilter(filterOptions)}
          setRef={cmp => this._catalogFilterView = cmp}
        />

        <p className='line-separator my-4' />
      </div>
    );
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <div className='container d-flex align-items-center flex-gap-36 my-4'>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        </div>
      );
    }

    return (
      <div className={`container`}>
        {this.getFilter()}

        {!this.state.list.length ? (
          <EmptyListView />
        ) : (
          <>
            <div className={`d-flex gap-20 pb-4 ${styles.scrollWrap}`}>
              {this.state.list.map(item => {
                let typeView = TokensType.created;

                return (
                  <TokenCardView
                    key={`profiletoken-${item.token_id}-${uid()}`}
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
                    price={item.metadata.price}
                    isForceVisible={true}
                    onClick={() => {
                    }}
                  />
                );
              })}
            </div>

            {this.state.isShowLoadMore && (
              <ButtonView
                text={'Load more'}
                onClick={() => {
                  this.setState({
                    ...this.state,
                    isBtnLoading: true,
                  });

                  this._pageSize *= 2;
                  this.loadData();
                }}
                color={buttonColors.goldBordered}
                customClass={`min-w-100px m-0-a py-2 my-5 d-block`}
                isLoading={this.state.isBtnLoading}
              />
            )}
          </>
        )}
      </div>
    );
  }
}

export default withComponent(ProfileTokensView);
