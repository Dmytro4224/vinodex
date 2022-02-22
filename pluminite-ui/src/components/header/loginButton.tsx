import { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { ICurrentUser } from "../../types/ICurrentUser";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import ButtonView, { buttonColors } from "../common/button/ButtonView";
import UserDropdown from "../header/userDropdown/userDropdown";
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

    return <UserDropdown user={this.props.user} />
  }
}

export default withComponent(LoginButton);