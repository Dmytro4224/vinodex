import {ChangeEvent, Component} from "react";
import styles from './inputView.module.css';

interface IInputView {
  placeholder: string;
  onChange: (e: ChangeEvent) => void;
};

class InputView extends Component<Readonly<IInputView>> {
  constructor(props: IInputView) {
    super(props);
  }

  private get placeholder() {
    return this.props.placeholder;
  }

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange(e);
  }

  public render() {
    return (
      <input
        onChange={this.onChange}
        placeholder={this.placeholder}
        className={styles.inputView}
        type="text"/>
    )
  }
}

export { InputView };