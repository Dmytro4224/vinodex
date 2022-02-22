import React, {Component} from "react";
import styles from './header.module.css';
import { HeaderNavigation } from "../navigation/HeaderNavigation";
import InputView from "../common/inputView/InputView";
import searchIcon from "../../assets/icons/search.svg";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import {dropdownColors, DropdownView} from "../common/dropdown/dropdownView";
import {IBaseComponentProps, IProps, withComponent} from "../../utils/withComponent";

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
            <h4 className={styles.logo}>Logo</h4>
            <HeaderNavigation />
          </div>
          <div style={{ maxWidth: '360px', width: '100%' }}>
            <InputView
              onChange={(e) => { console.log(e) }}
              placeholder={'Search'}
              icon={searchIcon}
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

            <ButtonView
              text={'CONNECT WALLET'}
              onClick={() => {  }}
              color={buttonColors.gray}
            />
            <ButtonView
              text={'CREATE'}
              onClick={() => {  }}
              color={buttonColors.goldFill}
            />
          </div>
        </div>
      </header>
    );
  }
}

export default withComponent(Header);