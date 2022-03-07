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
import logoImage from '../../assets/images/main-logo.jpg';
import sortIcon from '../../assets/icons/sort-icon.svg';
import filterIcon from '../../assets/icons/filter-icon.svg';
import searchIcon from "../../assets/icons/search.svg";
import MediaQuery from 'react-responsive';
import InputView, { InputStyleType } from "../../components/common/inputView/InputView";
import { dropdownData } from '../../components/common/dropdown/data';

interface IHome extends IProps {

}
class Home extends Component<IHome & IBaseComponentProps> {
  public state = {
    catalogs: new Array<any>(),
    sort: 7,
    currentCatalog: 0,
    isLoading: true
  };

  constructor(props: IHome & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    /*this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      this.props.near.setCatalogs(response);

      this.setState({...this.state, catalogs: response, currentCatalog: 0, sort: 7, isLoading: false });
    });*/

    this.setState({ ...this.state, currentCatalog: 0, sort: 7, isLoading: false });
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

  render() {
    if (this.state.isLoading) {
      return null;
    }

    console.log(`state`, this.state)

    return (
      <div>
        <MediaQuery minWidth={992}>
          <MainLogoView img={logoImage} title={'VINE & NFT'} />
        </MediaQuery>

        <div className="my-5 container">
          <MediaQuery minWidth={992}>
            <div className="d-flex align-items-center justify-content-between">
              <DropdownView
                colorType={dropdownColors.select}
                title={'Sort by'}
                onChange={(item) => { this.setSort(item.id) }}
                childrens={dropdownData}
              />

              <TabsFilterView currentTabIndex={this.state.currentCatalog} onClick={(index) => {
                this.setCatalog(index)
              }} />

              <ButtonView
                text={"Filter"}
                onClick={() => { }}
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
                    onClick={() => { }}
                    color={buttonColors.select}
                  />
                </div>
                <div className="d-flex align-items-center mt-4">
                  <TabsFilterView currentTabIndex={this.state.currentCatalog} onClick={(index) => {
                    this.setCatalog(index)
                  }} />
                </div>
              </div>
          </MediaQuery>

          <p className="separator-horizontal" />

          <TopTokensView sort={this.sort} catalog={this.catalog} />

          <p className="separator-horizontal" />

          <PopularTokensView sort={this.sort} catalog={this.catalog} />

          <p className="separator-horizontal" />

          <BestArtists />

          <p className="separator-horizontal" />

          <AllTokensView sort={this.sort} catalog={this.catalog} />

          {/*<div className="d-flex align-items-center justify-content-center mt-5 w-100">
            <ButtonView
              text={'Load more'}
              onClick={() => { }}
              color={buttonColors.select}
            />
          </div>*/}
        </div>
      </div>
    );
  }
}

export default withComponent(Home);

