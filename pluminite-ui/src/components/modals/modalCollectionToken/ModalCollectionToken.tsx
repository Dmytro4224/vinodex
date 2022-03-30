import React, { Component } from 'react';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './modalCollectionToken.module.css';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import Skeleton from 'react-loading-skeleton';
import TokenCardView from '../../tokenCard/tokenCardView';
import { mediaUrl } from '../../../utils/sys';

interface IModal extends IProps {
  onHideModal: () => void;
  inShowModal: boolean;
}

interface IModalState {
  list: Array<ITokenResponseItem>;
  isLoading: boolean;
}

class ModalCollectionToken extends Component<IModal & IBaseComponentProps> {
  public state: IModalState = {
    list: new Array<ITokenResponseItem>(),
    isLoading: true
  };

  constructor(props: IModal & IBaseComponentProps) {
    super(props);
  }

  // public componentDidMount() {
  //   this.loadData();
  // }

  // public componentDidUpdate(prevProps: Readonly<IModal & IBaseComponentProps>, prevState: Readonly<{}>, snapshot?: any) {
  //   this.loadData();
  // }

  private loadData() {
    this.props.nftContractContext.nft_tokens_by_filter(
      null,
      1,
      100,
      7,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    ).then(response => {
      this.setState({
        ...this.state,
        list: response,
        isLoading: false
      });
    });
  }

  private get modalIsShow() {
    return this.props.inShowModal;
  }

  private onHideModal() {
    this.props.onHideModal && this.props.onHideModal();
  }

  render() {
    return (
      <ModalSample
        customClass={'modalClean modalTokens'}
        size={ModalSampleSizeType.xl}
        modalTitle={''}
        isShow={this.modalIsShow}
        onHide={() => { this.onHideModal(); }}
        buttons={<></>}
      >
        {this.state.isLoading ? (
          <div className={styles.tokenWrap}>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          </div>
        ) : (
          <div className={styles.tokenWrap}>
            {this.state.list.map(item => {
              return (
                <TokenCardView
                  key={`modal-tokens-${item.token_id}`}
                  model={item}
                  countL={1}
                  countR={1}
                  days={item.metadata.expires_at}
                  name={item.metadata.title}
                  author={item.owner_id}
                  likesCount={item.metadata.likes_count}
                  icon={mediaUrl(item.metadata)}
                  isSmall={true}
                  buttonText={`Place a bid`}
                  linkTo={`/token/${item.token_id}`}
                  tokenID={item.token_id}
                  isLike={item.is_like}
                  isForceVisible={true}
                />
              );
            })}
          </div>
        )}
      </ModalSample>
    );
  }
}

export default withComponent(ModalCollectionToken);
