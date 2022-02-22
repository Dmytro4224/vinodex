import { Component } from "react";
import context from "react-bootstrap/esm/AccordionContext";
import { ICatalogResponceItem } from "../../types/ICatalogResponceItem";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import LabelView  from "../common/label/labelView";
import TabsView, {tabType } from "../common/tabs/TabsView";

interface ITabsFilterView extends IProps{
  catalogs?: Array<string>
}

class TabsFilterView extends Component<ITabsFilterView & IBaseComponentProps>{
  public state = { catalogs: new Array<any>(), isLoading: true };

  constructor(props: ITabsFilterView & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    // @ts-ignore
    this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      console.log(`response`, response);

      this.setState({...this.state, catalogs: response, isLoading: false });
    });
  }

  render(){
    if(this.state.isLoading){
      return <p>is loading</p>
    }

    return <><TabsView tabItems={this.state.catalogs?.map((catalog, i) => { return { title: catalog, id: i, link: '#' } })}
                       type={tabType.button}
                       onClick={(item) => {}}
                       currentTabIndex={0}/></>
  }
}

export default withComponent(TabsFilterView);