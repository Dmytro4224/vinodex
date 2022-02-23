import {ChangeEvent, Component} from "react";
import { Form } from "react-bootstrap";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import styles from './inputView.module.css';

interface IInputView extends IProps{
  onChange: (e: ChangeEvent) => void;
  placeholder: string;
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
  constructor(props: IInputView & IBaseComponentProps) {
    super(props);
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

  private get value() {
    return this.props.value;
  }

  private get isTextAreaType() {
    return this.props.viewType === ViewType.textarea;
  }

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange(e);
  }

  private getInputTypeStyle() {
    switch (this.inputType) {
      case InputType.default:
        return styles.inputDefault
      case InputType.round:
        return styles.inputRound
        break;
    }
  }

  public render() {
    return (
      <div className={`${styles.inputWrap} ${this.getInputTypeStyle()} ${this.props.customClass || ''}`}>

        {this.icon && <img className={styles.icon} src={this.icon} alt={this.alt} />}

        <Form.Control
          onChange={this.onChange}
          placeholder={this.placeholder}
          className={`${styles.inputView} ${this.absPlaceholder && styles.hidePlaceholder}`}
          value={this.value}
          type="text"
          as={this.isTextAreaType ? 'textarea' : 'input'}
        />

        { this.absPlaceholder && <span className={styles.absPlaceholder}>{this.absPlaceholder}</span> }

      </div>
    )
  }
}

export default withComponent(InputView);