import React, {Component} from "react";
import LabelView from "../common/label/labelView";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import ArtistCard from "../artistCard/ArtistCard";
import {IBaseComponentProps, IProps, withComponent} from "../../utils/withComponent";
import {IAuthorResponseItem} from "../../types/IAuthorResponseItem";
import Loader from "../common/loader/loader";
import { EmptyListView } from "../common/emptyList/emptyListView";
import { BestArtistsParameter } from '../../types/BestArtistsParameter';

interface IBestArtists extends IProps {
  parameter?: BestArtistsParameter;
  isReverse?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

class BestArtists extends Component<IBestArtists & IBaseComponentProps> {
  public state = {
    list: new Array<IAuthorResponseItem>(),
    isLoading: true,
  }

  constructor(props: IBestArtists & IBaseComponentProps) {
    super(props);
  }

  private get parameter() {
    return this.props.parameter || BestArtistsParameter.likes_count;
  }

  private get isReverse() {
    return typeof this.props.isReverse === 'undefined' ? true : this.props.isReverse;
  }

  private get pageIndex() {
    return typeof this.props.pageIndex === 'undefined' ? 1 : this.props.pageIndex;
  }

  private get pageSize() {
    return typeof this.props.pageSize === 'undefined' ? 8 : this.props.pageSize;
  }

  public componentDidMount() {
      this.props.nftContractContext.authors_by_filter(this.parameter, this.isReverse, this.pageIndex, this.pageSize).then(response => {
        console.log('componentDidMount response',response)
        this.list = response.filter(el => el  !== null);

        console.log("🚀 ~ file: BestArtists.tsx ~ line 57 ~ BestArtists ~ this.props.nftContractContext.authors_by_filter ~ response", response)
      });
  }

  private set list(list) {
    this.setState({
      ...this.state,
      list: list,
      isLoading: false
    });
  }

  private get list() {
    return this.state.list;
  }

  public render() {
    if (this.state.isLoading) {
      return <Loader />
    }

    if (!this.list.length) {
      return (
        <>
          <LabelView  text={'Best Artists'}/>
          <EmptyListView/>
        </>
      )
    }

    return (
      <>
        <div className="d-flex align-items-center justify-content-between mt-3">
          <LabelView  text={'Best Artists'}/>
          <ButtonView
            text={'More'}
            onClick={() => {  }}
            color={buttonColors.gold}
          />
        </div>

        <div className="d-flex flex-wrap flex-gap-36 mt-3">
          {this.list.map((item, index) => {

            return <ArtistCard
              key={index}
              info={item}
              identification={item.account_id}
              usersCount={item.followers_count}
              likesCount={item.likes_count}
              isLike={item.is_like}
              isFollow={item.is_following}
            />;
          })}
        </div>
      </>
    );
  }
}

export default withComponent(BestArtists);
