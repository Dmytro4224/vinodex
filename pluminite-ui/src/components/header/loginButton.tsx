import { Component } from "react";
import { ICurrentUser } from "../../types/ICurrentUser";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import ButtonView, { buttonColors } from "../common/button/ButtonView";
import {dropdownColors, DropdownView } from "../common/dropdown/dropdownView";

interface ILoginButton extends IProps{
  user: ICurrentUser | null
}

class LoginButton extends Component<ILoginButton & IBaseComponentProps>{
  constructor(props: ILoginButton & IBaseComponentProps) {
    super(props);
  }

  render(){
    if(this.props.user === null || this.props.user === undefined){
      return <ButtonView
        text={'CONNECT WALLET'}
        onClick={() => {
          this.props.near.signIn();
        }}
        color={buttonColors.gray}
      />
    }

    return (
      <DropdownView
        colorType={dropdownColors.select}
        title={'0x0b9D…2e14'}
        onChange={(item) => { this.props.near.signOut(); }}
        childrens={[
          {
            id: 1,
            title: 'Sign out'
          }
        ]}
      />
    )
  }
}

export default withComponent(LoginButton);