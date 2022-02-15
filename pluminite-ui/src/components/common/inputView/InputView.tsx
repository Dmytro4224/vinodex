import {ChangeEvent, Component} from "react";
import styles from './inputView.module.css';

interface IInputView {
  onChange: (e: ChangeEvent) => void;
  absPlaceholder?: string;
  placeholder?: string;
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

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange(e);
  }

  public render() {
    return (
      <div className={styles.inputWrap}>
        {this.icon && <img className={styles.icon} src={this.icon} alt={this.alt} />}
        <input
          onChange={this.onChange}
          placeholder={this.placeholder}
          className={styles.inputView}
          type="text"
        />
        { this.absPlaceholder && <span className={styles.absPlaceholder}>{this.absPlaceholder}</span> }
      </div>
    )
  }
}

export { InputView };