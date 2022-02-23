import React, {Component} from "react";
import styles from './header.module.css';
import {HeaderNavigation} from "../navigation/HeaderNavigation";
import InputView, {InputType} from "../common/inputView/InputView";
import LoginButton from "../header/loginButton";
import searchIcon from "../../assets/icons/search.svg";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import {dropdownColors, DropdownView} from "../common/dropdown/dropdownView";
import {IBaseComponentProps, IProps, withComponent} from "../../utils/withComponent";
import {NavLink} from "react-router-dom";
import logo from '../../assets/icons/logo.svg';

interface IHeader extends IProps{

}

class Header extends Component<IHeader & IBaseComponentProps> {
  constructor(props: IHeader & IBaseComponentProps) {
    super(props);

  }

  render() {
    return (
      <header className={styles.header}>
        <div className="container d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center">
            <NavLink to={"/"}><img className={styles.logo} width="104" height="26" src={logo} alt="logo"/></NavLink>
            <HeaderNavigation />
          </div>
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <InputView
              onChange={(e) => { console.log(e) }}
              placeholder={'Search'}
              icon={searchIcon}
              inputType={InputType.round}
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
            <LoginButton user={this.props.near.user} />

            <NavLink to={"/create"}>
              <ButtonView
                text={'CREATE'}
                onClick={() => {  }}
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