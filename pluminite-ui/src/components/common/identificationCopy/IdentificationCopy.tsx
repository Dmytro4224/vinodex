import React from "react";
import { Component } from "react";
import TooltipS, { PlacementType } from "../../common/tooltip/Tooltip";
import { transformArtistId } from "../../../utils/sys";
import styles from './identificationCopy.module.css';
import copyIcon from '../../../assets/icons/copy.svg'
import ButtonCopy from "../buttonCopy/ButtonCopy";

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

  private refChangeStyle() {
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
        <ButtonCopy
          onClick={() => { this.refChangeStyle() }}
          copyText={this.identification}
        />
      </div>
    )
  }
} 

export { IdentificationCopy };