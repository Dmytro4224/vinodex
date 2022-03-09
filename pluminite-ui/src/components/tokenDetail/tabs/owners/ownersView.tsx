import { Component } from "react";
import styles from './ownersView.module.css';
import defaultAvatar from '../../../../assets/images/avatar-def.png';
import ButtonCopy  from "../../../common/buttonCopy/ButtonCopy";
import {IBaseComponentProps, IProps, withComponent } from "../../../../utils/withComponent";
import Skeleton from "react-loading-skeleton";

interface IOwnersItemView extends IProps{
  avatar?: any;
  name: string;
  identification: string;
}

interface IOwnersView extends IProps{
  tokenId: string;
}

class OwnerItemView extends Component<IOwnersItemView & IBaseComponentProps> {
  constructor(props: IOwnersItemView & IBaseComponentProps) {
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
      </div>
    )
  }
}

const OwnerItem = withComponent(OwnerItemView);

interface IOwnersViewState{
  items: Array<any>;
  isLoading: boolean;
}

class OwnersView extends Component<IOwnersView & IBaseComponentProps>{
  public state:IOwnersViewState = { items: [], isLoading: true };

  constructor(props: IOwnersView & IBaseComponentProps) {
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

    this.props.nftContractContext.token_owners_history(this.tokenId, 1, 100).then(response => {
      console.log(`owners response`, response);
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
            return <OwnerItem key={i} name={child.account_id} identification={child.account_id} avatar={child.image} />
          })
        }
      </>
    )
  }
}

export default withComponent(OwnersView);
