import { Component } from "react";
import Skeleton from "react-loading-skeleton";
import { ITokenResponseItem } from "../../types/ITokenResponseItem";
import { mediaUrl } from '../../utils/sys';
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import ButtonView, {buttonColors } from "../common/button/ButtonView";
import { EmptyListView } from "../common/emptyList/emptyListView";
import LabelView  from "../common/label/labelView";
import Loader  from "../common/loader/loader";
import TokenCardView  from "../tokenCard/tokenCardView";
import styles from './popularTokens.module.css';

interface IPopularTokensView extends IProps{
  list?: Array<ITokenResponseItem>;
  catalog: string;
  sort: number;
}

class PopularTokensView extends Component<IPopularTokensView & IBaseComponentProps>{
  public state = { list: new Array<ITokenResponseItem>(), isLoading: true };

  constructor(props: IPopularTokensView & IBaseComponentProps) {
    super(props);
  }

  private get sort() {
    return this.props.sort || 7;
  }

  public componentDidMount() {
    this.props.nftContractContext.nft_tokens_by_filter(this.props.catalog, 1, 4, 7).then(response => {
      this.setState({ ...this.state, list: response, isLoading: false });
    });
  }

  public componentDidUpdate(prevProps: IPopularTokensView, prevState: any) {
    if (prevProps.catalog !== this.props.catalog || prevProps.sort !== this.props.sort) {
      //console.log('PopularTokensView componentDidUpdate: ', prevProps.catalog, this.props.catalog);
      this.props.nftContractContext.nft_tokens_by_filter(this.props.catalog, 1, 4, 7).then(response => {
        //console.log('PopularTokensView ', response);
        this.setState({ ...this.state, list: response, isLoading: false });
      });
    }
  }

  render() {
    if (this.state.isLoading) {
      return <div className={`d-flex align-items-center flex-gap-36 ${styles.scrollWrap}`}>
        <div className="w-100"><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className="w-100"><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
      </div>
    }

    if (!this.state.list.length) {
      return (
        <>
          <LabelView text={'Popular'} />
          <EmptyListView />
        </>
      )
    }

    return <div>
      <div className="d-flex align-items-center justify-content-between mt-3 flex-wrap">
        <LabelView text={'Popular'} />
        <ButtonView
          text={'Show all'}
          onClick={() => { this.props.navigate('/tokens/2') }}
          color={buttonColors.gold}
        />
      </div>
      <div className={`d-flex align-items-center flex-gap-36 ${styles.scrollWrap}`}>
        {this.state.list.map(item => {
          console.log('item.metadata.extra', item.metadata.extra);
          return <TokenCardView key={`${this.props.catalog}-populartoken-${item.token_id}`}
            model={item}
            countL={1}
            countR={1}
            days={item.metadata.expires_at}
            name={item.metadata.title}
            author={item.owner_id}
            likesCount={item.metadata.likes_count}
            icon={mediaUrl(item.metadata)}
            isSmall={true}
            buttonText={`Place a bid ${item.metadata.price} NEAR`}
            linkTo={`/token/${item.token_id}`}
            tokenID={item.token_id}
            isLike={item.is_like}
            onClick={() => {
              //this.props.navigate('/token/qwewqq-1231-weq-123');
            }} />
        })}
      </div>
    </div>
  }
}

export default withComponent(PopularTokensView);
