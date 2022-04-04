import { Component } from "react";
import { ICurrentUser } from "../../types/ICurrentUser";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import ButtonView, { buttonColors } from "../common/button/ButtonView";
import UserDropdown from "../header/userDropdown/userDropdown";
import walletIcon from '../../assets/icons/wallet.svg';

interface ILoginButton extends IProps {
  user: ICurrentUser | null
}

class LoginButton extends Component<ILoginButton & IBaseComponentProps>{
  constructor(props: ILoginButton & IBaseComponentProps) {
    super(props);
  }

  private onClick = async (e: React.MouseEvent) => {
    this.props.near.signIn();
  }

  render() {
    if (this.props.user === null || this.props.user === undefined) {
      return (
        <ButtonView
          text={'Wallet connect'}
          onClick={this.onClick}
          color={buttonColors.dark}
          icon={walletIcon}
          customClass={`px-4 py-2`}
        />
      )
    }

    return <UserDropdown user={this.props.user} />
  }
}

export default withComponent(LoginButton);
