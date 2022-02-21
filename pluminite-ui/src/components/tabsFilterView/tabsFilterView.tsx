import { Component } from "react";
import context from "react-bootstrap/esm/AccordionContext";
import { ICatalogResponceItem } from "../../types/ICatalogResponceItem";
import { LabelView } from "../common/label/labelView";
import { TabsView, tabType } from "../common/tabs/TabsView";

interface ITabsFilterView{
  catalogs: ICatalogResponceItem | null
}

class TabsFilterView extends Component<ITabsFilterView>{
  public state = { catalogs: new Array<ICatalogResponceItem>(), isLoading: true };

  constructor(props: ITabsFilterView) {
    super(props);
  }

  public componentDidMount() {
    // @ts-ignore
    //this.props.nftContractContext.nft_tokens_catalogs('art', 1, 10, 7).then(response => {
     // console.log(`response`, response);

      this.setState({...this.state, catalogs: this.props.catalogs, isLoading: false });
   // });
  }

  render(){
    if(this.state.isLoading){
      return <p>is loading</p>
    }

    return <><TabsView tabItems={[
      {title: "All", id: 1, link: "#"},
      {title: "Art", id: 2, link: "#"},
      {title: "Music", id: 3, link: "#"},
      {title: "Domain Names", id: 4, link: "#"},
      {title: "Virtual Worlds", id: 5, link: "#"},
      {title: "Trading Cards", id: 6, link: "#"},
      {title: "Collectibles", id: 7, link: "#"},
      {title: "Sports", id: 8, link: "#"},
      {title: "Utility", id: 9, link: "#"},
    ]} type={tabType.button}
                       onClick={(item) => {}}
                       currentTabIndex={0}/></>
  }
}

export default TabsFilterView;