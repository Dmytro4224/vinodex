import { Component } from "react";
import context from "react-bootstrap/esm/AccordionContext";
import { ICatalogResponceItem } from "../../types/ICatalogResponceItem";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import LabelView  from "../common/label/labelView";
import Loader from "../common/loader/loader";
import TabsView, {tabType } from "../common/tabs/TabsView";

interface ITabsFilterView extends IProps{
  catalogs?: Array<string>,
  currentTabIndex?: number;
  onClick: (index: number) => void
}

class TabsFilterView extends Component<ITabsFilterView & IBaseComponentProps>{
  public state = { catalogs: new Array<any>(), isLoading: true };

  constructor(props: ITabsFilterView & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    if(this.props.catalogs !== undefined){
      this.setState({...this.state, catalogs: this.props.catalogs, isLoading: false });
      return;
    }

    this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      this.setState({...this.state, catalogs: response, isLoading: false });
    });
  }

  private onClick = (index: number) => {
    this.props.onClick(index);
  }

  render(){
    if(this.state.isLoading){
      return <Loader />
    }

    return <><TabsView tabItems={this.state.catalogs?.map((catalog, i) => { return { title: catalog, id: i, link: '#' } })}
                       type={tabType.button}
                       onClick={(item) => { this.onClick(item.id) }}
                       currentTabIndex={this.props.currentTabIndex !== undefined ? this.props.currentTabIndex : 0}/></>
  }
}

export default withComponent(TabsFilterView);