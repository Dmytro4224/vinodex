import React, { ChangeEvent, Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './inputView.module.css';

export interface IInputView extends IProps {
  placeholder: string;
  onChange?: (e: ChangeEvent) => void;
  setRef?: any;
  absPlaceholder?: string;
  customClass?: string;
  value?: string;
  alt?: string;
  icon?: any;
  viewType?: ViewType;
  inputStyleType?: InputStyleType;
  inputType?: InputType;
  isError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

export enum InputStyleType {
  default = 'default',
  round = 'round'
}

export enum ViewType {
  input = 'input',
  textarea = 'textarea'
}

export enum InputType {
  text = 'text',
  number = 'number',
  email = 'email'
}

class InputView extends Component<IInputView & IBaseComponentProps> {
  private _ref: any;

  constructor(props: IInputView & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef();
    this.props.setRef && this.props.setRef(this);
  }

  public componentDidMount() {
    this.ref.current.value = this.initialValue || '';
  }

  public componentDidUpdate() {
    this.props.setRef && this.props.setRef(this);
    this.ref.current.value = this.initialValue || '';
  }

  private get inputStyleType() {
    return typeof this.props.inputStyleType === 'undefined' ? InputStyleType.default : this.props.inputStyleType;
  }

  private get inputType() {
    return typeof this.props.inputType === 'undefined' ? InputType.text : this.props.inputType;
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

  private get disabled() {
    return this.props.disabled;
  }

  private get isTextAreaType() {
    return this.props.viewType === ViewType.textarea;
  }

  private onChange = async (e: ChangeEvent) => {
    this.props.onChange && this.props.onChange(e);
  };

  private getInputTypeStyle() {
    switch (this.inputStyleType) {
      case InputStyleType.default:
        return styles.inputDefault;
      case InputStyleType.round:
        return styles.inputRound;
    }
  }

  public get value() {
    return this.ref.current?.value;
  }

  public set value(value) {
    this.ref.current.value = value;
  }

  private get isError() {
    return typeof this.props.isError === 'undefined' ? false : this.props.isError;
  }

  private get errorMessage() {
    return typeof this.props.errorMessage === 'undefined' ? '' : this.props.errorMessage;
  }

  public render() {
    return (
      <div className={`${this.props.customClass || ''} ${this.isError && styles.error}`}>
        <div className={`${styles.inputWrap} ${this.getInputTypeStyle()}`}>

          {this.icon && <img className={styles.icon} src={this.icon} alt={this.alt} />}

          <div className={styles.inputBox}>
            {!this.isTextAreaType ?
              <input
                onChange={this.onChange}
                placeholder={this.placeholder}
                className={`${styles.inputView} ${this.absPlaceholder && styles.hidePlaceholder}`}
                type={this.inputType}
                ref={this.ref}
                disabled={this.disabled}
              />
              :
              <textarea
                onChange={this.onChange}
                placeholder={this.placeholder}
                className={`${styles.inputView} ${this.absPlaceholder && styles.hidePlaceholder}`}
                ref={this.ref}
                disabled={this.disabled}
                // maxLength={250}
              />
            }

            {this.absPlaceholder && <label className={styles.absPlaceholder}>{this.absPlaceholder}</label>}

          </div>
        </div>

        {this.isError && <p className={styles.errorMessage}>{this.errorMessage}</p>}
      </div>
    );
  }
}

export default withComponent(InputView);
