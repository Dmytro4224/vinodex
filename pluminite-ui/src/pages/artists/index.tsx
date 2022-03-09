import React, { Component } from 'react';
import ArtistCard from '../../components/artistCard/ArtistCard';
import { BestArtistsParameter } from '../../types/BestArtistsParameter';
import { IAuthorResponseItem } from '../../types/IAuthorResponseItem';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import Loader from '../../components/common/loader/loader';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';

export interface IArtistsView extends IProps {
  parameter?: BestArtistsParameter;
  viewType?: ArtistViewType;
}

interface IArtistsViewState {
  isLoading: boolean;
  list: Array<IAuthorResponseItem>;
}

export enum ArtistViewType {
  profilePage = 'profilePage',
}

class ArtistsView extends Component<IArtistsView & IBaseComponentProps, IArtistsViewState> {

  private _parameter: BestArtistsParameter;
  private _pageIndex: number = 1;
  private _pageSize: number = 8;
  private _isReverse: boolean = true;

  constructor(props: IArtistsView & IBaseComponentProps) {
    super(props);

    this._parameter = this.props.parameter === void 0 ? BestArtistsParameter.likes_count : this.props.parameter;

    this.state = {
      isLoading: true,
      list: [],
    };
  }

  public componentDidMount() {
    this.getAuthors();
  }

  private getAuthors() {
    if (this.isProfilePageView) {
      this.getFollowingAuthors();
    } else {
      this.getAllAuthors();
    }
  }

  private getFollowingAuthors() {
    this.props.nftContractContext.followed_authors_for_account(this.props.params.userId!, this._pageIndex, this._pageSize).then(response => {
      let list = response.filter(item => item !== null);

      this.setState({
        ...this.state,
        list,
        isLoading: false,
      });
    });
  }

  private getAllAuthors() {
    this.props.nftContractContext.authors_by_filter(this._parameter, this._isReverse, this._pageIndex, this._pageSize).then(response => {
      let list = response.filter(item => item !== null);

      this.setState({
        ...this.state,
        list,
        isLoading: false,
      });
    });
  }

  public isLoading() {
    return this.state.isLoading;
  }

  private get viewType() {
    return this.props.viewType;
  }

  private get isProfilePageView() {
    return this.viewType === ArtistViewType.profilePage;
  }

  private get followBtnText() {
    return this.isProfilePageView ? 'your following' : '';
  }

  public render() {
    if (this.state.isLoading) {
      return (
        <div className='my-5 container'>
          <Loader />
        </div>
      );
    }

    if (this.state.list.length === 0) {
      return (
        <div className='my-5 container'>
          <EmptyListView />
        </div>
      );
    }

    return (
      <div className='my-5 container'>
        <div className='d-flex flex-wrap flex-gap-36 mt-3'>
          {this.state.list.map((item, index) => (
            <ArtistCard
              key={`artist-${item.account_id}`}
              info={item}
              identification={item.account_id}
              usersCount={item.followers_count}
              likesCount={item.likes_count}
              isLike={item.is_like}
              isFollow={item.is_following}
              followBtnText={this.followBtnText}
              isDisabledFollowBtn={this.isProfilePageView}
            />),
          )}
        </div>
      </div>
    );
  }
}

export default withComponent(ArtistsView);
