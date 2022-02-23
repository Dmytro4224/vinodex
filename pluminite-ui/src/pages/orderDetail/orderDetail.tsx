import { Component } from "react";
import TokenViewDetail from "../../components/tokenDetail/tokenViewDetail";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";

interface IOrderDetail extends IProps {
    
}

class OrderDetail extends Component<IOrderDetail & IBaseComponentProps, {}, any> {
    public render(){
      return (
        <TokenViewDetail/>
      )
    }
}

export default withComponent(OrderDetail);