import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import InputView, { InputStyleType, InputType } from "../common/inputView/InputView";
import styles from './inputSubscribe.module.css';
import sendIcon from '../../assets/icons/send-icon.svg';
import { isValidEmail } from "../../utils/sys";
import { Spinner } from "react-bootstrap";

interface ISubscribe extends IProps { }

class InputSubscribe extends Component<ISubscribe & IBaseComponentProps> {
  private _refInputEmail: any;

  state = {
    isLoading: false,
    isEmailValid: true,
    value: ''
  }

  private isValid() {
    if (this._refInputEmail.value.trim() === '' || !isValidEmail(this._refInputEmail.value.trim())) {
      this.setState({
        ...this.state,
        value: this._refInputEmail.value.trim(),
        isEmailValid: false,
      });

      return false;
    }

    return true;
  }

  private subscribeHandler = async () => {
    if (!this.isValid()) { return }

    this.setState({
      ...this.state,
      value: this._refInputEmail.value.trim(),
      isLoading: true,
      isEmailValid: true,
    })

    const sendingT = setTimeout(() => {
      this.setState({
        ...this.state,
        value: '',
        isLoading: false,
      })
    }, 3000);
  }

  render() {
    return (
      <div className={`d-flex align-center w-100 ${styles.subscrWrap}`}>
        <InputView
          onChange={(e) => {  }}
          placeholder={'Info@yourgmail.com'}
          inputStyleType={InputStyleType.round}
          customClass={`${styles.inputSubscribe}`}
          inputType={InputType.email}
          setRef={(ref) => { this._refInputEmail = ref; }}
          disabled={this.state.isLoading}
          isError={!this.state.isEmailValid}
          errorMessage={`Enter mail in the correct format.`}
          value={this.state.value}
        />
        <button onClick={this.subscribeHandler} className={styles.btnSubscribe}>
          {this.state.isLoading ? (
            <Spinner
              as="span"
              animation="grow"
              variant="light"
              size="sm"
              role="status"
              aria-hidden="true"
            />
          ) : (
            <img src={sendIcon} alt="send" />
          )}
        </button>
      </div>
    )
  }
}

export default withComponent(InputSubscribe)
