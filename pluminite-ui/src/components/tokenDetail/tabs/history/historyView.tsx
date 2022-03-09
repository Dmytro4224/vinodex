import { Component } from "react";
import styles from './historyView.module.css';
import defaultAvatar from '../../../../assets/images/avatar-def.png';
import ButtonCopy  from "../../../common/buttonCopy/ButtonCopy";
import {IBaseComponentProps, IProps, withComponent } from "../../../../utils/withComponent";
import Skeleton from "react-loading-skeleton";

interface IHistoryItemView extends IProps{
  avatar?: any;
  name: string;
  identification: string;
  price: number;
  currency: string
}

interface IHistoryView extends IProps{
  tokenId: string;
}

class HistoryItemView extends Component<IHistoryItemView & IBaseComponentProps> {
  constructor(props: IHistoryItemView & IBaseComponentProps) {
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

const HistoryItem = withComponent(HistoryItemView);

interface IHistoryViewState{
  items: Array<any>;
  isLoading: boolean;
}

class HistoryView extends Component<IHistoryView & IBaseComponentProps>{
  public state:IHistoryViewState = { items: [], isLoading: true };

  constructor(props: IHistoryView & IBaseComponentProps) {
    super(props);
  }

  private get childrens(){
    return this.state.items;
  }

  private get tokenId(){
    return this.props.tokenId;
  }

  public componentDidMount() {
    if(!this.props.near.user){ return }

    this.props.nftContractContext.sale_history(this.tokenId, 1, 100).then(response => {
      console.log(`history response`, response);
      this.setState({...this.state, items: response, isLoading: false });
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
            return <HistoryItem key={i} name={child.account_to.account_id} avatar={child.account_to.image} identification={child.account_to.account_id} price={child.price} currency={"NEAR"}/>
          })
        }
      </>
    )
  }
}

export default withComponent(HistoryView);
