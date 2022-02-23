import { Component } from "react";
import styles from './bidsView.module.css';
import defaultAvatar from '../../../../assets/images/avatar-def.png';
import ButtonCopy  from "../../../common/buttonCopy/ButtonCopy";
import {IBaseComponentProps, IProps, withComponent } from "../../../../utils/withComponent";

interface IBidsItemView extends IProps{
  avatar?: any;
  name: string;
  identification: string;
  price: number;
  currency: string
}

interface IBidsView extends IProps{
  items: IBidsItemView[]
}

class BidsItemView extends Component<IBidsItemView & IBaseComponentProps>{
  constructor(props: IBidsItemView & IBaseComponentProps) {
    super(props);
  }

  private get avatar() {
    return this.props.avatar;
  }

  private get name() {
    return this.props.name;
  }

  private get identification() {
    return this.props.identification;
  }

  private get price() {
    return this.props.price;
  }

  private get currency() {
    return this.props.currency;
  }

  render(){
    return(
      <div className={styles.bidsWrap}>
        <img className={styles.bidsAvatar} src={this.avatar || defaultAvatar} alt="avatar"/>
        <div>
          <p className={styles.bidsName}>{this.name}</p>
          <div className={styles.identificationWrap}>
            <p className={styles.bidsId}>{this.identification}</p>
            <ButtonCopy
              onClick={() => { }}
              copyText={this.identification}
            />
          </div>
        </div>
        <div className={styles.bidsPrice}>
            <span className={styles.price}>
              {this.price}&nbsp;{this.currency}
            </span>
        </div>
      </div>
    )
  }
}

const BidsItem = withComponent(BidsItemView);

class BidsView extends Component<IBidsView & IBaseComponentProps>{
  constructor(props: IBidsView & IBaseComponentProps) {
    super(props);
  }

  private get childrens(){
    return this.props.items;
  }

  render(){
    return(
      <>
        {
          this.childrens.map((child, i) => {
            return <BidsItem key={i} name={child.name} identification={child.identification} price={child.price} currency={child.currency}/>
          })
        }
      </>
    )
  }
}

export default withComponent(BidsView);