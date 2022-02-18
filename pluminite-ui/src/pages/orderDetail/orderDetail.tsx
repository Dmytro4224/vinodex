import { Component } from "react";
import { TokenViewDetail } from "../../components/tokenDetail/tokenViewDetail";

class OrderDetail extends Component{
    render(){
      //const { tokenHash } = this.props.match.params;

      return (
        <TokenViewDetail hash={'123wqe'}/>
      )
    }
}