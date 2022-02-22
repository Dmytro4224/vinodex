import { Component } from "react";
import Skeleton from "react-loading-skeleton";
import { ITokenResponseItem } from "../../types/ITokenResponseItem";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import CarouselView from "../carousel/carouselView";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import LabelView from "../common/label/labelView";
import Loader from "../common/loader/loader";
import TokenCardView from "../tokenCard/tokenCardView";

interface ITopTokensView extends IProps {
    list?: Array<ITokenResponseItem>;
    catalog: string;
}

class TopTokensView extends Component<ITopTokensView & IBaseComponentProps, {}, any> {
  public state = { list: new Array<ITokenResponseItem>(), isLoading: true };

    constructor(props: ITopTokensView & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.nftContractContext.nft_tokens_by_filter(this.props.catalog, 1, 4, 7).then(response => {
      console.log(`response`, response);

      this.setState({...this.state, list: response, isLoading: false });
    });
  }

  render(){

    if(this.state.isLoading){
      return <div className="d-flex align-items-center flex-gap-36">
        <div className="w-100"><Skeleton  count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton  count={1} height={300} /><Skeleton count={3} /></div>
      </div>
    }

    return (
      <div>
        <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap">
          <LabelView  text={'Top 10'}/>
          <ButtonView
            text={'More'}
            onClick={() => {  }}
            color={buttonColors.gold}
          />
        </div>
        <CarouselView customCLass={'carousel-owl-tokens'}
                      childrens={this.state.list.map(item => {
                        return <TokenCardView key={item.token_id}
                                              countL={1}
                                              countR={1}
                                              days={item.metadata.expires_at}
                                              name={item.metadata.title}
                                              author={item.owner_id}
                                              likesCount={99}
                                              icon={item.metadata.media}
                                              isSmall={false}
                                              buttonText={`Place a bid ${item.metadata.price} NEAR`}
                                              linkTo={`/token/qwewqq-1231-weq-123`}
                                              onClick={() => {
                                                //this.props.navigate('/token/qwewqq-1231-weq-123');
                                              }}/>;
                      })}/>
      </div>
    )
  }
}

export default withComponent(TopTokensView);