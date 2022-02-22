import React, {Component} from "react";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import {dropdownColors, DropdownView } from "../../components/common/dropdown/dropdownView";
import {IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import BestArtists from "../../components/bestArtists/BestArtists";
import TopTokensView from "../../components/topTokens/topTokensView";
import PopularTokensView from "../../components/popularTokens/popularTokensView";
import AllTokensView from "../../components/allTokens/allTokensView";
import TabsFilterView from "../../components/tabsFilterView/tabsFilterView";
import Loader from "../../components/common/loader/loader";

interface IHome extends IProps{

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
    // @ts-ignore
    this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      this.setState({...this.state, catalogs: response, currentCatalog: 0, isLoading: false });
    });
  }

  private set catalog(catalog){
    this.setState({...this.state, currentCatalog: catalog});
  }

  private get catalog(){
    return this.state.catalogs[this.state.currentCatalog];
  }

  render() {
    console.log(`current`, this.state.catalogs[this.state.currentCatalog]);

    if(this.state.isLoading){
      return <Loader />
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

          <TabsFilterView currentTabIndex={this.state.currentCatalog} onClick={(index) => { this.catalog = index }} />

          <ButtonView
            text={"Filter"}
            onClick={() => {  }}
            color={buttonColors.select}
          />
        </div>

        <p className="separator-horizontal" />

        <TopTokensView catalog={this.catalog}  />

        <p className="separator-horizontal" />

        <PopularTokensView/>

        <p className="separator-horizontal" />

        <BestArtists />

        <p className="separator-horizontal" />

        <AllTokensView />

        <div className="d-flex align-items-center justify-content-center mt-5 w-100">
          <ButtonView
                    text={'Load more'}
                    onClick={() => {
                        //@ts-ignore
                        console.log(this.props.params);
                         //@ts-ignore
                        this.props.navigate('/userProfile/q874587321JSAHFJHA');
                    }}
            color={buttonColors.select}
          />
            </div>



      </div>
    );
  }
}

export default withComponent(Home);

