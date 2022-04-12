import React, { Component } from "react";
import LabelView from "../common/label/labelView";
import ButtonView, { buttonColors } from "../common/button/ButtonView";
import ArtistCard from "../artistCard/ArtistCard";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { IAuthorResponseItem } from "../../types/IAuthorResponseItem";
import Loader from "../common/loader/loader";
import { EmptyListView } from "../common/emptyList/emptyListView";
import { BestArtistsParameter } from '../../types/BestArtistsParameter';
import styles from './bestArtists.module.css';
import Skeleton from 'react-loading-skeleton';
import { toast } from 'react-toastify';
import { UserTypes } from '../../types/NearAPI';

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
    this.props.nftContractContext.authors_by_filter(this.parameter, this.isReverse, this.pageIndex, this.pageSize, UserTypes.artist).then(response => {
      this.list = response.filter(el => el !== null);
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
      return (
        <div className={'d-flex align-items-center justify-content-between flex-wrap'}>
          <div className={styles.loaderWrap}>
            <Skeleton count={1} height={60} />
            <Skeleton count={2} height={20} />
          </div>
          <div className={styles.loaderWrap}>
            <Skeleton count={1} height={60} />
            <Skeleton count={2} height={20} />
          </div>
          <div className={styles.loaderWrap}>
            <Skeleton count={1} height={60} />
            <Skeleton count={2} height={20} />
          </div>
          <div className={styles.loaderWrap}>
            <Skeleton count={1} height={60} />
            <Skeleton count={2} height={20} />
          </div>
        </div>
      )
    }

    if (!this.list.length) {
      return (
        <>
          <LabelView text={'Best Artists'} />
          <EmptyListView />
        </>
      )
    }

    return (
      <>
        <div className="d-flex align-items-center justify-content-between mt-3">
          <LabelView text={'Best Artists'} />
          <ButtonView
            text={'Explore more'}
            customClass={'btn-explore-more'}
            onClick={() => { this.props.navigate('/artists') }}
            color={buttonColors.gold}
          />
        </div>

        <div className={`mt-3 ${styles.artistWrap}`}>
          {this.list.map((item, index) => {
            if (item.account_id !== 'grafarsena.testnet') {
              return <ArtistCard
                key={index}
                info={item}
                identification={item.account_id}
                usersCount={item.followers_count}
                likesCount={item.likes_count}
                isLike={item.is_liked}
                isFollow={item.is_following}
                customClass={styles.artistMobile}
              />;
            }
          })}
        </div>
      </>
    );
  }
}

export default withComponent(BestArtists);
