import React, { Component } from "react";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import { dropdownColors, DropdownView } from "../../components/common/dropdown/dropdownView";
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import AllTokensInCatalogView from "../../components/allTokensInCatalog/allTokensInCatalogView";
import TabsFilterView from "../../components/tabsFilterView/tabsFilterView";
import { MainLogoView } from "../../components/mainLogo/mainLogoView";
import logoImage from '../../assets/images/main-logo.jpg';
import sortIcon from '../../assets/icons/sort-icon.svg';
import filterIcon from '../../assets/icons/filter-icon.svg';
import searchIcon from "../../assets/icons/search.svg";
import MediaQuery from 'react-responsive';
import InputView, { InputStyleType } from "../../components/common/inputView/InputView";
import { dropdownData } from "../../components/common/dropdown/data";
import { IFilterOptions } from "../../types/IFilterOptions";
import CatalogFilterView from "../../components/catalogFilterView/CatalogFilterView";

interface ICatalogTokens extends IProps {

}

class CatalogTokens extends Component<ICatalogTokens & IBaseComponentProps> {
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

  private _catalogFilterView: any;

  constructor(props: ICatalogTokens & IBaseComponentProps) {
    super(props);

    this._catalogFilterView = React.createRef();
  }

  private setFilter(filterOptions: IFilterOptions) {
    this.setState({ ...this.state, filterOptions })
  }

  private onFilterClick = async (e: React.MouseEvent<Element>) => {
    e.preventDefault();
    this._catalogFilterView.toogle();
  }

  private get type() {
    let type = 'Top 10';

    if (this.props.params.type === undefined) { return type }

    switch (+this.props.params.type) {
      case 1:
        type = 'Top 10';
        break;
      case 2:
        type = 'Popular';
        break;
      case 3:
        type = 'All';
        break;
    }
    return type;
  }

  public componentDidMount() {
    /*this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      this.props.near.setCatalogs(response);

      this.setState({...this.state, catalogs: response, -1, sort: 7, isLoading: false });
    });*/

    this.setState({ ...this.state, currentCatalog: -1, sort: 7, isLoading: false });
  }

  private setCatalog(catalog: number) {
    this.setState({ ...this.state, currentCatalog: catalog });
  }

  private setSort(sort: number) {
    this.setState({ ...this.state, sort: sort });
  }

  private get catalog() {
    return this.props.near.catalogs[this.state.currentCatalog];
  }

  private get sort() {
    return this.state.sort;
  }

  public render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <div>
        <MediaQuery minWidth={992}>
          <MainLogoView isSmall={true} onClick={() => { this.props.navigate('/home') }} img={logoImage} title={this.type} />
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
              {/*  this.setCatalog(index)*/}
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
                <InputView
                  onChange={(e) => { console.log(e) }}
                  placeholder={'Search'}
                  icon={searchIcon}
                  inputStyleType={InputStyleType.round}
                />
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
          <AllTokensInCatalogView
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

export default withComponent(CatalogTokens);

