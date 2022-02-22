import {ChangeEvent, Component} from "react";
import { Form } from "react-bootstrap";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import styles from './inputView.module.css';

interface IInputView extends IProps{
  onChange: (e: ChangeEvent) => void;
  absPlaceholder?: string;
  placeholder: string;
  customClass?: string;
  value?: string;
  alt?: string;
  icon?: any;
  isTextarea?: boolean;
};

class InputView extends Component<IInputView & IBaseComponentProps> {
  constructor(props: IInputView & IBaseComponentProps) {
    super(props);
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

  private get isTextarea() {
    return this.props.isTextarea;
  }

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange(e);
  }

  public render() {
    return (
      <div className={`${styles.inputWrap} ${this.props.customClass || ''}`}>
        {this.icon && <img className={styles.icon} src={this.icon} alt={this.alt} />}
        <Form.Control
          onChange={this.onChange}
          placeholder={this.placeholder}
          className={`${styles.inputView} ${this.absPlaceholder && styles.hidePlaceholder}`}
          value={this.value}
          type="text"
          as={this.isTextarea ? 'textarea' : 'input'}
        />
        { this.absPlaceholder && <span className={styles.absPlaceholder}>{this.absPlaceholder}</span> }
      </div>
    )
  }
}

export default withComponent(InputView);