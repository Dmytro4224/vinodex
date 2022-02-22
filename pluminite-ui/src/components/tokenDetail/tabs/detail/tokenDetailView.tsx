import { Component } from "react";
import {IBaseComponentProps, IProps, withComponent } from "../../../../utils/withComponent";
import ButtonCopy  from "../../../common/buttonCopy/ButtonCopy";
import { IdentificationCopy } from "../../../common/identificationCopy/IdentificationCopy";
import styles from './tokenDetailView.module.css';

interface ITokenDetailView extends IProps{
  address: string,
  id: string
}

class TokenDetailView extends Component<ITokenDetailView & IBaseComponentProps>{
  constructor(props: ITokenDetailView & IBaseComponentProps) {
    super(props);
  }

  private get address(){
    return this.props.address;
  }

  private get id(){
    return this.props.id;
  }

  render(){
    return (
        <div className={styles.detailWrap}>
          <div className={styles.detailItem}>
            <div className={styles.info}>
                <h5 className={styles.title}>{this.address}</h5>
                <p className={styles.ex}>example</p>
            </div>
            <ButtonCopy
              onClick={() => { }}
              copyText={this.address}
            />
          </div>
          <div className={styles.detailItem}>
            <div className={styles.info}>
              <h5 className={styles.title}>{this.id}</h5>
              <p className={styles.ex}>example</p>
            </div>
            <ButtonCopy
              onClick={() => { }}
              copyText={this.id}
            />
          </div>
        </div>
    )
  }
}

export default withComponent(TokenDetailView);