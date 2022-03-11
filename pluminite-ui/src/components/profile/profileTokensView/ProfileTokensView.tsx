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
import { mediaUrl } from '../../../utils/sys';
import { TokensType } from '../../../types/TokenTypes';

interface IProfileTokensView extends IProps {
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: number;
  typeViewTokens?: ProfileTokensType;
}

class ProfileTokensView extends Component<IProfileTokensView & IBaseComponentProps> {
  private _typeViewParams = {
    [ProfileTokensType.onSale]: [true, this.props.params.userId],
    [ProfileTokensType.createdItems]: [null, this.props.params.userId],
    [ProfileTokensType.purchases]: [null, this.props.params.userId],
    [ProfileTokensType.activeBids]: [null, this.props.params.userId, null, null, true],
    [ProfileTokensType.favourites]: [null, this.props.params.userId, true, null, true],
  };

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
    this.props.nftContractContext.nft_tokens_by_filter(
      this.catalog,
      1,
      4,
      this.sort,
      // ...this._typeViewParams[this.typeViewTokens || ProfileTokensType.createdItems]
    ).then(response => {
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
      case ProfileTokensType.createdItems:
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
                    onClick={() => {
                    }}
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
      // case ProfileTokensType.createdItems:
      //   return (
      //     <>
      //       <div className={`d-flex align-items-center justify-content-center my-4 ${styles.filterWrap}`}>
      //         <InputView
      //           customClass={styles.inputSearch}
      //           onChange={(e) => {
      //             console.log(e);
      //           }}
      //           placeholder={'Search'}
      //           icon={searchIcon}
      //           inputStyleType={InputStyleType.round}
      //         />
      //       </div>
      //       <p className='line-separator my-4' />
      //     </>
      //   );
    }
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
          <div className={`d-flex flex-gap-36 pb-4 ${styles.scrollWrap}`}>
            {this.state.list.map(item => {
              // Якщо об'єкт sale не null, то значіть він на продажі
              // І в тому об'єкті є поле sale_type. 2 і 3 це аукціони

              let typeView = TokensType.created;

              return (
                <TokenCardView
                  key={`profiletoken-${item.token_id}`}
                  model={item}
                  countL={1}
                  countR={1}
                  days={item.metadata.expires_at}
                  name={item.metadata.title}
                  author={item.owner_id}
                  likesCount={item.metadata.likes_count}
                  icon={mediaUrl(item.metadata)}
                  isSmall={true}
                  buttonText={`Place a bid ${item.metadata.price} NEAR`}
                  linkTo={`/token/${item.token_id}`}
                  tokenID={item.token_id}
                  isLike={item.is_like}
                  price={item.metadata.price}
                  isForceVisible={true}
                  onClick={() => {
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    );
  }
}

export default withComponent(ProfileTokensView);
