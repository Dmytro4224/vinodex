import { Component } from "react";
import TokenViewDetail from "../../components/tokenDetail/tokenViewDetail";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";

interface IOrderDetail extends IProps {
    
}

class OrderDetail extends Component<IOrderDetail & IBaseComponentProps, {}, any> {
    public render(){
      //const { tokenHash } = this.props.match.params;

      return (
        <TokenViewDetail hash={'123wqe'}/>
      )
    }
}

export default withComponent(OrderDetail);