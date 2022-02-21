import { Component } from "react";

interface ITokenDetailItemView{

}

interface ITokenDetailView{

}

class TokenDetailItemView extends Component<ITokenDetailItemView>{
  constructor(props: ITokenDetailItemView) {
    super(props);
  }

  render(){
    return (
      <div></div>
    )
  }
}

class TokenDetailView extends Component<ITokenDetailView>{
  constructor(props: ITokenDetailView) {
    super(props);
  }

  render(){
    return (
      <TokenDetailItemView />
    )
  }
}