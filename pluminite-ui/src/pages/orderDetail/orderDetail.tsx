import { Component } from "react";
import TokenViewDetail from "../../components/tokenDetail/tokenViewDetail";
import { withComponent } from "../../utils/withComponent";

class OrderDetail extends Component{
    render(){
      //const { tokenHash } = this.props.match.params;

      return (
        <TokenViewDetail hash={'123wqe'}/>
      )
    }
}

export default withComponent(OrderDetail);