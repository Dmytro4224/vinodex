import React, {ChangeEvent, Component} from "react";
import { Form } from "react-bootstrap";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import styles from './inputView.module.css';

interface IInputView extends IProps {
  placeholder: string;
  onChange?: (e: ChangeEvent) => void;
  setRef?: any;
  absPlaceholder?: string;
  customClass?: string;
  value?: string;
  alt?: string;
  icon?: any;
  viewType?: ViewType;
  inputType?: InputType;
};

export enum InputType {
  default = 'default',
  round = 'round'
}

export enum ViewType {
  input = 'input',
  textarea = 'textarea'
}

class InputView extends Component<IInputView & IBaseComponentProps> {
  private _ref: any;

  constructor(props: IInputView & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef();
    this.props.setRef && this.props.setRef(this);
  }

  private get inputType() {
    return typeof this.props.inputType === 'undefined' ? InputType.default : this.props.inputType;
  }

  private get placeholder() {
    return this.props.placeholder;
  }

  private get absPlaceholder() {
    return this.props.absPlaceholder;
  }

  private get icon() {
    return this.props.icon;
  }

  private get alt() {
    return this.props.alt;
  }

  private get initialValue() {
    return this.props.value;
  }

  private get ref() {
    return this._ref;
  }

  private get isTextAreaType() {
    return this.props.viewType === ViewType.textarea;
  }

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange && this.props.onChange(e);
  }

  private getInputTypeStyle() {
    switch (this.inputType) {
      case InputType.default:
        return styles.inputDefault
      case InputType.round:
        return styles.inputRound
    }
  }

  public get value() {
    return this.ref.current?.value;
  }

  public render() {
    return (
      <div className={`${styles.inputWrap} ${this.getInputTypeStyle()} ${this.props.customClass || ''}`}>

        {this.icon && <img className={styles.icon} src={this.icon} alt={this.alt} />}

        <Form.Control
          onChange={this.onChange}
          placeholder={this.placeholder}
          className={`${styles.inputView} ${this.absPlaceholder && styles.hidePlaceholder}`}
          value={this.initialValue}
          type="text"
          as={this.isTextAreaType ? 'textarea' : 'input'}
          ref={this.ref}
        />

        { this.absPlaceholder && <span className={styles.absPlaceholder}>{this.absPlaceholder}</span> }

      </div>
    )
  }
}

export default withComponent(InputView);