import React, {Component} from "react";
import LabelView from "../common/label/labelView";
import ButtonView, {buttonColors} from "../common/button/ButtonView";
import ArtistCard from "../artistCard/ArtistCard";
import {IBaseComponentProps, IProps, withComponent} from "../../utils/withComponent";
import {IAuthorResponseItem} from "../../types/IAuthorResponseItem";
import Loader from "../common/loader/loader";

interface IBestArtists extends IProps {
  parameter?: BestArtistsParameter;
  isReverse?: boolean;
  pageIndex?: number;
  pageSize?: number;
}

export enum BestArtistsParameter {
  likes_count = 0, // кількість лайків аккаунту
  tokens_likes_count = 1, // кількість лайків токенів аккаунту
  views_count = 2, // загальна ксть переглядів аккаунту
  tokens_views_count = 3, // загальна ксть переглядів токенів аккаунту
  tokens_count = 4, // загальна ксть токенів
  followers_count = 5, // к-сть підписників автора
  total_likes_count = 6, // загальна ксть  лайків аккаунт+токени
  total_views_count = 7, // загальна ксть  переглядів
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
    return this.props.parameter || BestArtistsParameter.followers_count;
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
        this.list = response;

        console.log(`response authors_by_filter`, response);

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
          <p className="mt-3">No items found</p>
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

        <div className="d-flex flex-wrap flex-gap-36 mt-3 justify-content-between">
          {this.list.map((item, index) => {
            return <ArtistCard
              key={index}
              name={'Artist Name'}
              identification={'0x0b9D2weq28asdqwe132'}
              usersCount={22}
              likesCount={12}
              isFollow={false}
            />;
          })}
        </div>
      </>
    );
  }
}

export default withComponent(BestArtists);