import React from "react";
import { Component } from "react";
import { PlacementType, TooltipS } from "../../common/tooltip/Tooltip";
import { transformArtistId } from "../../../utils/sys";
import styles from './identificationCopy.module.css';
import copyIcon from '../../../assets/icons/copy.svg'

interface IIdentificationCopy {
  id: string;
}

class IdentificationCopy extends Component<Readonly<IIdentificationCopy>> {
  private readonly _refIdentificationText:  React.RefObject<HTMLParagraphElement>;

  constructor(props: IIdentificationCopy) {
    super(props);

    this._refIdentificationText = React.createRef();
  }

  private get identification() {
    return this.props.id;
  }

  private copyToClipboard() {
    navigator.clipboard.writeText(this.identification);

    this._refIdentificationText.current?.classList.add(styles.colorCopySuccess);

    const t = setTimeout(() => {
      this._refIdentificationText.current?.classList.remove(styles.colorCopySuccess);
      clearTimeout(t);
    }, 1500);
  }
  
  render() {
    return (
      <div className={styles.identificationWrap}>
        <p ref={this._refIdentificationText} className={styles.artistId}>{transformArtistId(this.identification)}</p>
        <TooltipS
          placement={PlacementType.top}
          text={`Copy to clipboard`}
          children={
            <button
              onClick={() => { this.copyToClipboard() }}
              className={styles.btnCopy}>
              <img src={copyIcon} alt="copy"/>
            </button>
          }
        />
      </div>
    )
  }
} 

export { IdentificationCopy };