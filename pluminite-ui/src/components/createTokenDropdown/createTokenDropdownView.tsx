import { Component } from 'react';
import { Dropdown } from 'react-bootstrap';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import styles from './createTokenDropdownView.module.css';
import singleIcon from '../../assets/icons/singleToken.svg';
import multiplyIcon from '../../assets/icons/multipleToken.svg';
import {IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';

interface ICreateTokenDropdownView extends IProps {
  onNavigated?: () => void;
}

class CreateTokenDropdownView extends Component<ICreateTokenDropdownView & IBaseComponentProps>{
  constructor(props: ICreateTokenDropdownView & IBaseComponentProps) {
    super(props);
  }

  private createAction(isMultiple: boolean) {
    this.props.onNavigated && this.props.onNavigated();

    if (this.props.near.isAuth) {
      if (isMultiple){
        this.props.navigate('/create/multiple');
      } else {
        this.props.navigate('/create/single');
      }
    } else {
      this.props.near.signIn();
    }
  }

  render() {
    return (
      <ButtonView
        text={'CREATE'}
        onClick={() => { this.createAction(false); }}
        color={buttonColors.goldFill}
        customClass={`ml-10px min-w-100px`}
      />

      // <Dropdown className={styles.dropWrap}>
      //   <Dropdown.Toggle variant="" id="dropdown-basic" className={`${styles.isHiddenArrow} ${styles.goldFill} ${styles.fixMobileBtn}`}>
      //     CREATE
      //   </Dropdown.Toggle>
      //
      //   <Dropdown.Menu>
      //     <Dropdown.Item className={styles.item}>
      //       <div className={`w-100 d-flex align-items-center justify-content-center flex-column ${styles.createDropdown}`}>
      //         <div className={styles.mainTitleWrap}>
      //           <h3 className={styles.mainTitle}>Create NFT</h3>
      //           <p className={styles.mainSubTitle}>Choose “Single” if you want your collectible to be one of a find or “Multiple” if you want to sell one collectible multiple times.</p>
      //         </div>
      //         <div className={styles.createTypeWrap}>
      //           <div onClick={() => { this.createAction(false) }} className={`${styles.single} ${styles.tokenWrap}`}>
      //             <img src={singleIcon} alt=""/>
      //             <p className={styles.line} />
      //             <h5>Single</h5>
      //           </div>
      //           <div onClick={() => { this.createAction(true) }} className={`${styles.multiply} ${styles.tokenWrap}`}>
      //             <img src={multiplyIcon} alt=""/>
      //             <p className={styles.line} />
      //             <h5>Multiple</h5>
      //           </div>
      //         </div>
      //       </div>
      //     </Dropdown.Item>
      //   </Dropdown.Menu>
      // </Dropdown>
    )
  }
}

export default withComponent(CreateTokenDropdownView);
