import { Component } from "react";
import styles from './bidsView.module.css';
import defaultAvatar from '../../../../assets/images/avatar-def.png';
import ButtonCopy  from "../../../common/buttonCopy/ButtonCopy";
import {IBaseComponentProps, IProps, withComponent } from "../../../../utils/withComponent";
import { formatDate } from "../../../../utils/sys";
import Skeleton from "react-loading-skeleton";
import {convertYoctoNearsToNears, onlyNumber } from '../../../../utils/sys';

interface IBidsItemView extends IProps{
  avatar?: any;
  name: string;
  identification: string;
  price: number;
  currency: string
}

interface IBidsView extends IProps{
  tokenId: string;
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
              {convertYoctoNearsToNears(this.price)}&nbsp;{this.currency}
            </span>
        </div>
      </div>
    )
  }
}

const BidsItem = withComponent(BidsItemView);

interface IBidsViewState{
  item: any;
  isLoading: boolean;
}

class BidsView extends Component<IBidsView & IBaseComponentProps>{
  public state:IBidsViewState = { item: null, isLoading: true };

  constructor(props: IBidsView & IBaseComponentProps) {
    super(props);
  }

  private get childrens(){
    return this.state.item?.bids;
  }

  private get tokenId(){
    return this.props.tokenId;
  }

  public componentDidMount() {
    if(!this.props.near.user){ return }

    this.props.nftContractContext.sale_get(this.tokenId, true).then(response => {
      this.setState({...this.state, item: response, isLoading: false });
    });
  }

  render(){
    if(this.state.isLoading){
      return <div>
        <div className="w-100"><Skeleton  count={2} height={30} /></div>
      </div>
    }

    if(!this.childrens || !this.childrens.length){
      return <div className={"w-100 text-center"}>No items found</div> ;
    }

    return(
      <>
        {
          this.childrens.map((child, i) => {
            return <BidsItem key={i} name={child.account.account_id} avatar={child.account.image} identification={formatDate(new Date(child.date))} price={child.price} currency={"NEAR"}/>
          })
        }
      </>
    )
  }
}

export default withComponent(BidsView);
