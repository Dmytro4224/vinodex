import { Component } from "react";
import Skeleton from "react-loading-skeleton";
import { ITokenResponseItem } from "../../types/ITokenResponseItem";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import { EmptyListView } from "../common/emptyList/emptyListView";
import LabelView from "../common/label/labelView";
import Loader from "../common/loader/loader";
import TokenCardView from "../tokenCard/tokenCardView";

interface IAllTokensView extends IProps{
  list?: Array<ITokenResponseItem>;
  catalog: string;
}

class AllTokensView extends Component<IAllTokensView & IBaseComponentProps>{
  public state = { list: new Array<ITokenResponseItem>(), isLoading: true };

  constructor(props: IAllTokensView & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    // @ts-ignore
    this.props.nftContractContext.nft_tokens_by_filter(this.props.catalog, 1, 4, 7).then(response => {

      this.setState({...this.state, list: response, isLoading: false });
    });
  }

  public componentDidUpdate(prevProps: IAllTokensView, prevState: any) {
    if(prevProps.catalog !== this.props.catalog){
      this.props.nftContractContext.nft_tokens_by_filter(this.props.catalog, 1, 4, 7).then(response => {

        this.setState({...this.state, list: response, isLoading: false });
      });
    }
  }

  render(){
    if(this.state.isLoading){
      return <div className="d-flex align-items-center flex-gap-36">
        <div className="w-100"><Skeleton  count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton  count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton  count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton  count={1} height={300} /><Skeleton count={3} /></div>
      </div>
    }

    if (!this.state.list.length) {
      return (
        <>
          <LabelView  text={'All'}/>
          <EmptyListView/>
        </>
      )
    }

    return <div>
          <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap">
            <LabelView  text={'All'}/>
            <ButtonView
              text={'More'}
              onClick={() => {  }}
              color={buttonColors.gold}
            />
        </div>
        <div className="d-flex align-items-center flex-gap-36">
          {this.state.list.map(item => {
            return <TokenCardView key={item.token_id}
                                  countL={1}
                                  countR={1}
                                  days={item.metadata.expires_at}
                                  name={item.metadata.title}
                                  author={item.owner_id}
                                  likesCount={item.metadata.likes_count}
                                  icon={item.metadata.media}
                                  isSmall={true}
                                  buttonText={`Place a bid ${item.metadata.price} NEAR`}
                                  linkTo={`/token/qwewqq-1231-weq-123`}
                                  tokenID={item.token_id}
                                  isLike={item.is_like}
                                  onClick={() => {
                                    //this.props.navigate('/token/qwewqq-1231-weq-123');
                                  }}/>
          })}
        </div>
      </div>
  }
}

export default withComponent(AllTokensView);
