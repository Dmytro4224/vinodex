import React, { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { EmptyListView } from '../common/emptyList/emptyListView';
import TokenCardView from '../tokenCard/tokenCardView';
import styles from './profileTokensView.module.css';
import { dropdownColors, DropdownView } from '../common/dropdown/dropdownView';
import { dropdownData } from '../common/dropdown/data';
import TabsFilterView from '../tabsFilterView/tabsFilterView';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import searchIcon from '../../assets/icons/search.svg';
import InputView, { InputStyleType } from '../common/inputView/InputView';
import { ProfileTokensType } from '../../types/ProfileTokenTypes';
import MediaQuery from 'react-responsive';
import sortIcon from '../../assets/icons/sort-icon.svg';
import filterIcon from '../../assets/icons/filter-icon.svg';

interface IProfileTokensView extends IProps {
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: number;
  typeViewTokens?: ProfileTokensType;
}

class ProfileTokensView extends Component<IProfileTokensView & IBaseComponentProps> {
  public state = {
    list: new Array<ITokenResponseItem>(),
    sort: 7,
    currentCatalog: 0,
    catalog: this.props.near.catalogs[0],
    isLoading: true,
  };

  constructor(props: IProfileTokensView & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps, prevState) {
    if (prevState.catalog !== this.catalog || prevState.sort !== this.sort) {
      this.loadData();
    }
  }

  private loadData() {
    this.props.nftContractContext.nft_tokens_by_filter(this.catalog, 1, 4, this.sort).then(response => {
      this.setState({
        ...this.state,
        list: response,
        isLoading: false,
        catalog: this.catalog,
        sort: this.sort,
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
    switch (this.typeViewTokens) {
      case ProfileTokensType.onSale:
      case ProfileTokensType.purchases:
      case ProfileTokensType.activeBids:
      case ProfileTokensType.favourites:
      case ProfileTokensType.owned:
        return (
          <>
            <MediaQuery minWidth={992}>
              <div className={`d-flex align-items-center justify-content-between my-4 ${styles.filterWrap}`}>
                <DropdownView
                  colorType={dropdownColors.select}
                  title={'Sort by'}
                  onChange={(item) => {
                    this.setSort(item.id);
                  }}
                  childrens={dropdownData}
                />

                <TabsFilterView
                  currentTabIndex={this.state.currentCatalog}
                  onClick={(index) => {
                    this.setCatalog(index);
                  }}
                />

                <ButtonView
                  text={'Filter'}
                  onClick={() => {
                  }}
                  color={buttonColors.select}
                />
              </div>
            </MediaQuery>
            <MediaQuery maxWidth={991}>
              <div className="d-flex flex-column w-100">
                <div className="d-flex align-items-center justify-content-between">
                  <DropdownView
                    colorType={dropdownColors.select}
                    title={''}
                    icon={sortIcon}
                    hideArrow={true}
                    onChange={(item) => { this.setSort(item.id) }}
                    childrens={dropdownData}
                  />

                  <ButtonView
                    text={""}
                    withoutText={true}
                    icon={filterIcon}
                    onClick={() => { }}
                    color={buttonColors.select}
                  />
                </div>
                <div className={`d-flex align-items-center mt-4 ${styles.filterWrap}`}>
                  <TabsFilterView
                    currentTabIndex={this.state.currentCatalog}
                    onClick={(index) => {
                      this.setCatalog(index);
                    }}
                  />
                </div>
              </div>
            </MediaQuery>

            <p className='line-separator my-4' />
          </>
        );
        break;
      case ProfileTokensType.createdItems:
        return (
          <>
            <div className={`d-flex align-items-center justify-content-center my-4 ${styles.filterWrap}`}>
              <InputView
                customClass={styles.inputSearch}
                onChange={(e) => {
                  console.log(e);
                }}
                placeholder={'Search'}
                icon={searchIcon}
                inputStyleType={InputStyleType.round}
              />
            </div>
            <p className='line-separator my-4' />
          </>
        );
        break;
    }
  }

  private get isTransferAction() {
    return (
      this.typeViewTokens === ProfileTokensType.activeBids
      || this.typeViewTokens === ProfileTokensType.purchases
      || this.typeViewTokens === ProfileTokensType.createdItems
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

    if (!this.state.list.length) {
      return (
        <EmptyListView />
      );
    }

    return (
      <div className={`container`}>
        {this.getFilter()}

        <div className={`d-flex align-items-center flex-gap-36 pb-4 ${styles.scrollWrap}`}>
          {this.state.list.map(item => {
            return (
              <TokenCardView
                key={item.token_id}
                countL={1}
                countR={1}
                days={item.metadata.expires_at}
                name={item.metadata.title}
                author={item.owner_id}
                likesCount={item.metadata.likes_count}
                icon={item.metadata.media}
                isSmall={true}
                buttonText={`Place a bid ${item.metadata.price} NEAR`}
                linkTo={`/token/${item.token_id}`}
                tokenID={item.token_id}
                isLike={item.is_like}
                typeView={this.typeViewTokens}
                price={item.metadata.price}
                isTransferAction={this.isTransferAction}
                onClick={() => {
                }}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

export default withComponent(ProfileTokensView);
