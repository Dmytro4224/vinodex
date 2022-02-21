import React, {Component} from "react";
import {PlacementType, TooltipS} from "../tooltip/Tooltip";
import styles from "../identificationCopy/identificationCopy.module.css";
import copyIcon from "../../../assets/icons/copy.svg";

interface IButtonCopy {
  copyText: string;
  onClick?: () => void;
}

class ButtonCopy extends Component<IButtonCopy> {
  constructor(props: IButtonCopy) {
    super(props);
  }

  private get copyText() {
    return this.props.copyText;
  }

  private copyToClipboard() {
    navigator.clipboard.writeText(this.copyText);
  }

  private buttonHandler() {
    this.copyToClipboard();
    this.props.onClick && this.props.onClick();
  }

  render() {
    return (
      <TooltipS
        placement={PlacementType.top}
        text={`Copy to clipboard`}
        children={
          <button
            onClick={() => { this.buttonHandler(); }}
            className={styles.btnCopy}>
            <img src={copyIcon} alt="copy"/>
          </button>
        }
      />
    );
  }
}

export { ButtonCopy };