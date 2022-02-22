import { Component } from "react";
import TokenViewDetail from "../../components/tokenDetail/tokenViewDetail";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";

interface IOrderDetail extends IProps {
    
}

class OrderDetail extends Component<IOrderDetail & IBaseComponentProps, {}, any> {

  public componentDidMount() {
    // @ts-ignore
    this.props.nftContractContext.nft_token_get("5").then(response => {

      this.setState({...this.state, list: response, isLoading: false });
    });
  }

    public render(){
      //const { tokenHash } = this.props.match.params;

      return (
        <TokenViewDetail hash={'123wqe'}/>
      )
    }
}

export default withComponent(OrderDetail);