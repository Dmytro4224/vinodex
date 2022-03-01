import React, { Component } from "react";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import { dropdownColors, DropdownView } from "../../components/common/dropdown/dropdownView";
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import BestArtists from "../../components/bestArtists/BestArtists";
import TopTokensView from "../../components/topTokens/topTokensView";
import PopularTokensView from "../../components/popularTokens/popularTokensView";
import AllTokensView from "../../components/allTokens/allTokensView";
import TabsFilterView from "../../components/tabsFilterView/tabsFilterView";

interface IHome extends IProps {

}
class Home extends Component<IHome & IBaseComponentProps> {
  public state = {
    catalogs: new Array<any>(),
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

  private get catalog() {
    return this.props.near.catalogs[this.state.currentCatalog];
  }

  render() {
    if (this.state.isLoading) {
      return null;
    }

    return (
      <div className="my-5 container">
        <div className="d-flex align-items-center justify-content-between">
          <DropdownView
            colorType={dropdownColors.select}
            title={'Sort by'}
            onChange={(item) => { console.log(item) }}
            childrens={[
              {
                id: 1,
                title: 'Recently Listed'
              },
              {
                id: 2,
                title: 'Recently Created'
              },
              {
                id: 3,
                title: 'Recently Sold'
              }
            ]}
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

        <p className="separator-horizontal" />

        <TopTokensView catalog={this.catalog} />

        <p className="separator-horizontal" />

        <PopularTokensView catalog={this.catalog} />

        <p className="separator-horizontal" />

        <BestArtists />

        <p className="separator-horizontal" />

        <AllTokensView catalog={this.catalog} />

        <div className="d-flex align-items-center justify-content-center mt-5 w-100">
          <ButtonView
            text={'Load more'}
            onClick={() => { }}
            color={buttonColors.select}
          />
        </div>
      </div>
    );
  }
}

export default withComponent(Home);

