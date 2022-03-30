import { Component } from "react";
import styles from './header.module.css';
import { HeaderNavigation } from "../navigation/HeaderNavigation";
import InputView, { InputStyleType } from "../common/inputView/InputView";
import LoginButton from "../header/loginButton";
import searchIcon from "../../assets/icons/search.svg";
import { dropdownColors, DropdownView } from "../common/dropdown/dropdownView";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { NavLink } from "react-router-dom";
import logo from '../../assets/icons/logo.svg';
import MediaQuery from 'react-responsive'
import Menu from "./menu/Menu";
import CreateTokenDropdownView from "../createTokenDropdown/createTokenDropdownView";

interface IHeader extends IProps {
  setToUpdateUser: (updateMtd) => void;
}

class Header extends Component<IHeader & IBaseComponentProps> {
  public state = {
    profile: null
  }

  constructor(props: IHeader & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.setToUpdateUser(() => this.getUserInfo())
    this.getUserInfo();
  }

  private getUserInfo() {
    if (!this.props.near.user) return;

    this.props.nftContractContext.getProfile(this.props.near.user?.accountId!).then(profile => {
      if (profile) {
        this.userProfile = profile;
      }
    });
  }

  set userProfile(profile) {
    this.setState({
      ...this.state,
      profile: {
        accountId: profile.account_id,
        name: profile.name,
        email: profile.email,
        bio: profile.bio,
        image: profile.image,
      }
    })
  }

  render() {
    return (
      <header className={styles.header}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <NavLink to={"/"}><img className={styles.logo} width="104" height="26" src={logo} alt="logo" /></NavLink>
            <MediaQuery minWidth={992}>
              <HeaderNavigation />
            </MediaQuery>
          </div>
          <MediaQuery minWidth={992}>
            {/*<div className={styles.inputSearchWrap}>*/}
              {/*<InputView*/}
              {/*  onChange={(e) => {  }}*/}
              {/*  placeholder={'Search'}*/}
              {/*  icon={searchIcon}*/}
              {/*  disabled={true}*/}
              {/*  customClass={"setOpacity"}*/}
              {/*  inputStyleType={InputStyleType.round}*/}
              {/*/>*/}
            {/*</div>*/}
            <div className={`d-flex align-items-center ${styles.buttonWrap}`}>
              {/*<DropdownView*/}
              {/*  colorType={dropdownColors.selectGray}*/}
              {/*  title={'En'}*/}
              {/*  disabled={true}*/}
              {/*  onChange={(item) => {  }}*/}
              {/*  childrens={[*/}
              {/*    {*/}
              {/*      id: 1,*/}
              {/*      title: 'UK'*/}
              {/*    },*/}
              {/*    {*/}
              {/*      id: 2,*/}
              {/*      title: 'US'*/}
              {/*    },*/}
              {/*  ]}*/}
              {/*/>*/}

              {/*<span className={styles.separator} />*/}

              <LoginButton user={this.state.profile} />

              {this.props.near.isAuth && <CreateTokenDropdownView customBtnClass={'ml-10px'} />}
            </div>
          </MediaQuery>

          <MediaQuery maxWidth={992}>
            <Menu user={this.state.profile} />
          </MediaQuery>
        </div>
      </header>
    );
  }
}

export default withComponent(Header);
