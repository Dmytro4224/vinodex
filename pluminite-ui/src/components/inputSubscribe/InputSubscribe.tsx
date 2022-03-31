import { Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import InputView, { InputStyleType, InputType } from "../common/inputView/InputView";
import styles from './inputSubscribe.module.css';
import sendIcon from '../../assets/icons/send-icon.svg';
import { isValidEmail } from "../../utils/sys";
import { Spinner } from "react-bootstrap";
import ModalProcessing, { IModalProcessing } from '../modals/modalProcessing/ModalProcessing';
import ModalComplete from '../modals/modalComplete/ModalComplete';

interface ISubscribe extends IProps { }

interface IInputSubscibeState {
  isLoading: boolean;
  isProcessing: boolean;
  isComplete: boolean;
  isEmailValid: boolean;
  value: string;
}

class InputSubscribe extends Component<ISubscribe & IBaseComponentProps, IInputSubscibeState> {
  private _refInputEmail: any;

  private _modalProcessing?: IModalProcessing;

  state = {
    isLoading: false,
    isProcessing: false,
    isComplete: false,
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
      isProcessing: true,
      isEmailValid: true,
    });

    setTimeout(_ => {
      if (this._modalProcessing !== void 0) {
        this._modalProcessing.progressBar?.run();
      }
    }, 10);
  }

  public stopModalProgress = async () => {
    this.setState({
      ...this.state,
      value: '',
      isLoading: true,
      isProcessing: false,
      isComplete: true
    });
  }

  private stopModalComplete = async () => {
    this.setState({
      ...this.state,
      value: '',
      isLoading: false,
      isComplete: false,
      isProcessing: false
    });
  }

  public render() {
    return (
      <div className={`d-flex align-center w-100 ${styles.subscrWrap}`}>
        <InputView
          onChange={(e) => { }}
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
        {this.state.isProcessing &&
          <ModalProcessing
            setRef={impl => this._modalProcessing = impl}
            inShowModal={true}
            onComplete={this.stopModalProgress}
          />
        }
        {this.state.isComplete &&
          <ModalComplete
            inShowModal={true}
            onHideModal={this.stopModalComplete}
          />
        }
      </div>
    )
  }
}

export default withComponent(InputSubscribe)
