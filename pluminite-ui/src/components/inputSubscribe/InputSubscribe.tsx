import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import InputView, { InputStyleType } from "../common/inputView/InputView";
import styles from './inputSubscribe.module.css';
import sendIcon from '../../assets/icons/send-icon.svg';

interface ISubscribe extends IProps { }

class InputSubscribe extends Component<ISubscribe & IBaseComponentProps> {
  render() {
    return (
      <div className={`d-flex align-center w-100 ${styles.subscrWrap}`}>
        <InputView
          onChange={(e) => { console.log(e) }}
          placeholder={'Info@yourgmail.com'}
          inputStyleType={InputStyleType.round}
          customClass={`${styles.inputSubscribe}`}
        />
        <button className={styles.btnSubscribe}>
          <img src={sendIcon} alt="send" />
        </button>
      </div>
    )
  }
}

export default withComponent(InputSubscribe)