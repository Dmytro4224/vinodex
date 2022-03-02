import React, { Component } from "react";
import styles from './header.module.css';
import { HeaderNavigation } from "../navigation/HeaderNavigation";
import InputView, { InputStyleType } from "../common/inputView/InputView";
import LoginButton from "../header/loginButton";
import searchIcon from "../../assets/icons/search.svg";
import ButtonView, { buttonColors } from "../common/button/ButtonView";
import { dropdownColors, DropdownView } from "../common/dropdown/dropdownView";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { NavLink } from "react-router-dom";
import logo from '../../assets/icons/logo.svg';

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
      console.log("🚀 ~ file: Header.tsx ~ line 35 ~ Header ~ this.props.nftContractContext.getProfile ~ profile", profile)

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
            <HeaderNavigation />
          </div>
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <InputView
              onChange={(e) => { console.log(e) }}
              placeholder={'Search'}
              icon={searchIcon}
              inputStyleType={InputStyleType.round}
            />
          </div>
          <div className={`d-flex align-items-center ${styles.buttonWrap}`}>
            <DropdownView
              colorType={dropdownColors.selectGray}
              title={'En'}
              onChange={(item) => { console.log(item) }}
              childrens={[
                {
                  id: 1,
                  title: 'UK'
                },
                {
                  id: 2,
                  title: 'US'
                },
              ]}
            />

            <span className={styles.separator} />

            <LoginButton user={this.state.profile} />

            <NavLink
              className={styles.linkCreate}
              to={"/create"}>
              <ButtonView
                text={'CREATE'}
                onClick={() => { }}
                color={buttonColors.goldFill}
              />
            </NavLink>

          </div>
        </div>
      </header>
    );
  }
}

export default withComponent(Header);