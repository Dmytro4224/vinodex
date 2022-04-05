import React, { Component } from 'react';
import ArtistCard, { ArtistType } from '../../components/artistCard/ArtistCard';
import { BestArtistsParameter } from '../../types/BestArtistsParameter';
import { IAuthorResponseItem } from '../../types/IAuthorResponseItem';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { EmptyListView } from '../../components/common/emptyList/emptyListView';
import styles from '../../components/bestArtists/bestArtists.module.css';
import Skeleton from 'react-loading-skeleton';
import { NavLink } from 'react-router-dom';
import { MainLogoView } from '../../components/mainLogo/mainLogoView';
import bgArtist from '../../assets/images/bg-artitst.png';
import { UserTypes } from '../../types/NearAPI';

export interface IArtistsView extends IProps {
  parameter?: BestArtistsParameter;
  viewType?: ArtistViewType;
  userType?: UserTypes;
  pageSize?: number;
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
  private _pageSize: number = this.props.pageSize || 1000;
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
    window.scrollTo(0, 0);
    this.getAuthors();
  }

   public componentDidUpdate(prevProps, prevState) {
    if (prevProps.userType !== this.props.userType) {
      this.getAuthors();
    }
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

  private get userType() {
    return this.props.userType || UserTypes.all;
  }

  private getAllAuthors() {
    this.props.nftContractContext.authors_by_filter(this._parameter, this._isReverse, this._pageIndex, this._pageSize, this.userType).then(response => {
      let list = response.filter(item => item !== null && item.name && item.name.length !== 0);
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

  private get pageTitle() {
    if (this.userType === UserTypes.artist) return 'Artists';
    if (this.userType === UserTypes.creator) return 'Creators';
    return 'Artists';
  }

  public render() {
    return (
      <div>
        {!this.isProfilePageView && (
          <MainLogoView
            img={bgArtist}
            title={this.pageTitle}
            bgWrap={'#807F68'}
            bgHeadInfo={'#5E4C1A'}
            breadcrumbs={
              <>
                <NavLink to={'/'}>Home</NavLink>
                <span className='breadcrumb__separator'>/</span>
                <p>{this.pageTitle}</p>
              </>
            }
          />
        )}
        {this.state.isLoading ? (
          <div className='d-flex w-100 align-items-center flex-gap-36 my-4 flex-wrap-500px container'>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          </div>
        ) : !this.state.list.length ? (
          <div className='my-5 container'>
            <EmptyListView />
          </div>
        ) : (
          <div className={`container my-4 ${styles.listWrap}`}>
            {this.state.list.map((item, index) => (
              <ArtistCard
                linkTo={this.userType === UserTypes.creator ? `/creators/${item.account_id}` : ''}
                key={`artist-${item.account_id}`}
                info={item}
                identification={item.account_id}
                usersCount={item.followers_count}
                likesCount={item.likes_count}
                isLike={item.is_liked}
                isFollow={item.is_following}
                followBtnText={this.followBtnText}
                isDisabledFollowBtn={this.isProfilePageView}
                isForceVisible={this.isProfilePageView}
                type={ArtistType.big}
              />),
            )}
          </div>
        )}
      </div>
    )
  }
}

export default withComponent(ArtistsView);
