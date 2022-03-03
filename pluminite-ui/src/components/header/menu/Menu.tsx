import { Component } from "react";
import styles from './menu.module.css';
import closeIcon from '../../../assets/icons/close.svg'
import { dropdownColors, DropdownView } from "../../common/dropdown/dropdownView";

class Menu extends Component {
  state = {
    isOpen: false
  }

  private toggleMenu() {
    this.setState({
      isOpen: !this.state.isOpen
    })
  }

  render() {
    return (
      <>
        <input
          checked={this.state.isOpen}
          className={styles.inputMenu}
          onChange={() => this.toggleMenu()}
          hidden
          type="checkbox"
          id="menuBtn"
        />
        <label htmlFor="menuBtn" className={styles.label}>
          <div></div>
          <div></div>
          <div></div>
        </label>

        <div onClick={() => this.toggleMenu()} className={`${styles.menuWrap} ${this.state.isOpen && styles.open}`} />
        <div className={`${styles.menu} ${this.state.isOpen && styles.open}`}>
          <div className="d-flex align-items-center justify-content-between p-3">
            <button className={styles.btnClose} onClick={() => this.toggleMenu()}><img src={closeIcon} alt="close" /></button>
            <DropdownView
              colorType={dropdownColors.selectGray}
              title={'En'}
              disabled={true}
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
          </div>
        </div>
      </>
    )
  }
}

export { Menu }