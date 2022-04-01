import React, { Component } from "react";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import { dropdownColors, DropdownView } from "../../components/common/dropdown/dropdownView";
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import BestArtists from "../../components/bestArtists/BestArtists";
import TopTokensView from "../../components/topTokens/topTokensView";
import PopularTokensView from "../../components/popularTokens/popularTokensView";
import AllTokensView from "../../components/allTokens/allTokensView";
import TabsFilterView from "../../components/tabsFilterView/tabsFilterView";
import { MainLogoView } from "../../components/mainLogo/mainLogoView";
import logoImage from '../../assets/images/bg-t.png';
import sortIcon from '../../assets/icons/sort-icon.svg';
import filterIcon from '../../assets/icons/filter-icon.svg';
import searchIcon from "../../assets/icons/search.svg";
import MediaQuery from 'react-responsive';
import InputView, { InputStyleType } from "../../components/common/inputView/InputView";
import { dropdownData } from '../../components/common/dropdown/data';
import CatalogFilterView from '../../components/catalogFilterView/CatalogFilterView';
import { IFilterOptions } from "../../types/IFilterOptions";
import TopCollection from '../../components/topCollection/TopCollection';

interface IHome extends IProps {}

class Home extends Component<IHome & IBaseComponentProps> {

  private _catalogFilterView: any;

  public state = {
    catalogs: new Array<any>(),
    sort: 7,
    currentCatalog: -1,
    isLoading: true,
    filterOptions: {
      type: null,
      priceFrom: null,
      priceTo: null,
    }
  };

  constructor(props: IHome & IBaseComponentProps) {
    super(props);

    this._catalogFilterView = React.createRef();
  }

  public componentDidMount() {
    this.setState({ ...this.state, currentCatalog: -1, sort: 7, isLoading: false });
  }

  private setCatalog(catalog: number) {
    this.setState({ ...this.state, currentCatalog: catalog });
  }

  private setSort(sort: number) {
    this.setState({ ...this.state, sort: sort });
  }

  private setFilter(filterOptions: IFilterOptions) {
    this.setState({ ...this.state, filterOptions })
  }

  private get catalog() {
    return this.props.near.catalogs[this.state.currentCatalog];
  }

  private get sort() {
    return this.state.sort;
  }

  private onFilterClick = async (e: React.MouseEvent<Element>) => {
    e.preventDefault();
    this._catalogFilterView.toogle();
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <div>
        <MediaQuery minWidth={992}>
          <MainLogoView
            img={logoImage}
            title={'VINE & NFT'}
          />
        </MediaQuery>

        <div className="my-5 container">
          <MediaQuery minWidth={992}>
            <div className="d-flex align-items-center justify-content-between">
              <DropdownView
                colorType={dropdownColors.selectFilter}
                title={'Sort by'}
                onChange={(item) => { this.setSort(item.id) }}
                childrens={dropdownData}
              />

              {/*<TabsFilterView currentTabIndex={this.state.currentCatalog} onClick={(index) => {*/}
              {/*  this.setCatalog(index);*/}
              {/*}} />*/}

              <ButtonView
                text={"Filter"}
                onClick={this.onFilterClick}
                color={buttonColors.select}
                customClass={'btn-filter'}
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
                {/*<InputView
                  onChange={(e) => { console.log(e) }}
                  placeholder={'Search'}
                  icon={searchIcon}
                  inputStyleType={InputStyleType.round}
                />*/}
                <ButtonView
                  text={""}
                  withoutText={true}
                  icon={filterIcon}
                  onClick={this.onFilterClick}
                  color={buttonColors.select}
                />
              </div>
              {/*<div className="d-flex align-items-center mt-4">*/}
              {/*  <TabsFilterView currentTabIndex={this.state.currentCatalog} onClick={(index) => {*/}
              {/*    this.setCatalog(index)*/}
              {/*  }} />*/}
              {/*</div>*/}
            </div>
          </MediaQuery>

          <CatalogFilterView
            setFilter={(filterOptions: IFilterOptions) => this.setFilter(filterOptions)}
            setRef={cmp => this._catalogFilterView = cmp}
          />

          <p className="separator-horizontal" />

          <TopTokensView
            priceFrom={this.state.filterOptions.priceFrom}
            priceTo={this.state.filterOptions.priceTo}
            type={this.state.filterOptions.type}
            sort={this.sort}
            catalog={this.catalog}
          />

          <p className="separator-horizontal" />

          <TopCollection />

          <p className="separator-horizontal" />

          <PopularTokensView
            priceFrom={this.state.filterOptions.priceFrom}
            priceTo={this.state.filterOptions.priceTo}
            type={this.state.filterOptions.type}
            sort={this.sort}
            catalog={this.catalog}
          />

          <p className="separator-horizontal" />

          <BestArtists />

          <p className="separator-horizontal" />

          <AllTokensView
            priceFrom={this.state.filterOptions.priceFrom}
            priceTo={this.state.filterOptions.priceTo}
            type={this.state.filterOptions.type}
            sort={this.sort}
            catalog={this.catalog}
          />

        </div>
      </div>
    );
  }
}

export default withComponent(Home);

