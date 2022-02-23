import React from "react";
import { Component } from "react";
import { pinataAPI } from "../../api/Pinata";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";

interface ICreateToken extends IProps{

}

class CreateToken extends Component<ICreateToken & IBaseComponentProps>{
  private _ref: React.RefObject<HTMLInputElement>;

  constructor(props: ICreateToken & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef<HTMLInputElement>();
  }

  private onFile = async () => {
    const file = this._ref.current?.files ? this._ref.current?.files[0] : null;

    if(file === null){ return }

    let res = await pinataAPI.uploadFile(file);

    console.log(`file`, res);
  }

  render(){
    return <div>
        <h3>Create Single NFT</h3>
        <input ref={this._ref} type="file" onChange={this.onFile} name="file" id="file"/>
    </div>
  }
}

export default withComponent(CreateToken);