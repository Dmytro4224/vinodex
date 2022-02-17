import {ChangeEvent, Component} from "react";
import { Form } from "react-bootstrap";
import styles from './inputView.module.css';

interface IInputView {
  onChange: (e: ChangeEvent) => void;
  absPlaceholder?: string;
  placeholder: string;
  customClass?: string;
  value?: string;
  alt?: string;
  icon?: any;
};

class InputView extends Component<Readonly<IInputView>> {
  constructor(props: IInputView) {
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

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange(e);
  }

  public render() {
    return (
      <div className={styles.inputWrap}>
        {this.icon && <img className={styles.icon} src={this.icon} alt={this.alt} />}
        <Form.Control
          onChange={this.onChange}
          placeholder={this.placeholder}
          className={`${styles.inputView} ${this.absPlaceholder && styles.hidePlaceholder} ${this.props.customClass || ''}`}
          value={this.value}
          type="text"
        />
        { this.absPlaceholder && <span className={styles.absPlaceholder}>{this.absPlaceholder}</span> }
      </div>
    )
  }
}

export { InputView };