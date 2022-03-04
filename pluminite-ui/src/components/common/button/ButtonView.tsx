import styles from './ButtonView.module.css';
import React, { MouseEvent, Component } from "react";
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { Spinner } from 'react-bootstrap';

enum buttonColors {
  blue = 'blue',
  white = 'white',
  gray = 'gray',
  whiteGray = 'whiteGray',
  select = 'select',
  primary = 'primary',
  selectGray = 'selectGray',
  darkGray = 'darkGray',
  gold = 'gold',
  goldFill = 'goldFill',
}

interface IButtonView extends IProps {
  text: string;
  onClick: (event: MouseEvent) => void;
  color: buttonColors;
  customClass?: string;
  icon?: any;
  withoutText?: boolean;
  isLoading?: boolean;
}

class ButtonView extends Component<Readonly<IButtonView & IBaseComponentProps>>{
  private readonly _ref: React.RefObject<HTMLButtonElement>;

  constructor(props: IButtonView & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef();
  }

  public get text() {
    return this.props.text
  }

  public get buttonColor() {
    let color = 'blue';

    switch (this.props.color) {
      case 'blue':
        color = styles.btnBlue;
        break;
      case 'white':
        color = styles.btnWhite;
        break;
      case 'select':
        color = styles.btnSelect;
        break;
      case 'primary':
        color = styles.btnPrimary;
        break;
      case 'gray':
        color = styles.btnGray;
        break;
      case 'whiteGray':
        color = styles.btnWhiteGray;
        break;
      case 'selectGray':
        color = styles.btnSelectGray;
        break;
      case 'darkGray':
        color = styles.btnDarkGray;
        break;
      case 'gold':
        color = styles.btnGold;
        break;
      case 'goldFill':
        color = styles.btnGoldFill;
        break;
    }

    return color;
  }

  private onClick = async (event: MouseEvent) => {
    this.props.onClick(event);
  }

  private get isLoading() {
    return this.props.isLoading;
  }

  public render() {
    return (
      <button
        disabled={this.isLoading}
        ref={this._ref}
        onClick={this.onClick}
        className={`${styles.buttonView} ${this.buttonColor} ${this.props.icon && styles.btnIcon} ${this.props.customClass || ''}`}
      >
        {this.isLoading && <>
          <Spinner
            as="span"
            animation="grow"
            size="sm"
            role="status"
            aria-hidden="true"
          />
        </>}
        {this.props.withoutText || this.isLoading ? `` : <span className={styles.btnText}>{this.text}</span>}
        {this.props.icon && <i style={{ backgroundImage: `url(${this.props.icon})` }} className={`${styles.icon}`} />}
      </button>
    )
  }
}

export default withComponent(ButtonView);
export { buttonColors }
