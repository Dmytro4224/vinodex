import React, { Component } from 'react';
import ModalSample, { ModalSampleSizeType } from '../../common/modalSample/ModalSample';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './modalCollectionToken.module.css';
import { ITokenResponseItem } from '../../../types/ITokenResponseItem';
import Skeleton from 'react-loading-skeleton';
import TokenCardView from '../../tokenCard/tokenCardView';
import { mediaUrl } from '../../../utils/sys';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { ICollectionResponseItem } from '../../../types/ICollectionResponseItem';
import ModalConfirm from '../modalConfirm/ModalConfirm';
import { EmptyListView } from '../../common/emptyList/emptyListView';

interface IModal extends IProps {
  onHideModal: () => void;
  inShowModal: boolean;
  collectionData: ICollectionResponseItem | null;
}

interface IModalState {
  list: Array<ITokenResponseItem> | null;
  isLoading: boolean;
  isShowConfirmModal: boolean;
  modalConfirmData: any;
}

class ModalCollectionToken extends Component<IModal & IBaseComponentProps> {
  public state: IModalState = {
    list: null,
    isLoading: true,
    isShowConfirmModal: false,
    modalConfirmData: {
      text: '',
      confirmCallback: () => {
      },
    },
  };

  constructor(props: IModal & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.loadData();
  }

  // public componentDidUpdate(prevProps: Readonly<IModal & IBaseComponentProps>, prevState: Readonly<{}>, snapshot?: any) {
  //   if (this.state.list === null) {
  //     this.loadData();
  //   }
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
      ''
    ).then(response => {
      this.setState({
        ...this.state,
        list: response || [],
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

  private isTokenAdded(id) {
    return this.props.collectionData?.tokens?.find(token => token.token_id === id);
  }

  private removeTokenFromCollection(token_id) {
    this.props.nftContractContext.collection_token_remove(token_id).then(res => {
      this.setState({ ...this.state })
    })

    // this.modalToggleVisibility({
    //   isShowConfirmModal: true,
    //   modalConfirmData: {
    //     text: 'Are you sure you want to remove this NFT from collection?',
    //     confirmCallback: () => {
    //       this.props.nftContractContext.collection_token_remove(token_id).then(res => {
    //         this.modalToggleVisibility({ isShowConfirmModal: false });
    //       })
    //     },
    //   },
    // });
  }

  private modalToggleVisibility(data: object) {
    this.setState({
      ...this.state,
      ...data,
    });
  }

  private addTokenFromCollection(token_id) {
    this.props.nftContractContext.collection_token_add(
      this.props.collectionData?.collection_id!,
      token_id
    ).then(res => {
      this.setState({ ...this.state })
    })
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
        <>
          <ModalConfirm
            inShowModal={this.state.isShowConfirmModal}
            onHideModal={() => {
              this.setState({ isShowConfirmModal: false });
            }}
            onSubmit={() => {
              this.state.modalConfirmData.confirmCallback();
            }}
            confirmText={this.state.modalConfirmData.text}
          />
        {this.state.isLoading ? (
          <div className={styles.tokenWrap}>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
            <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
          </div>
        ) : this.state.list?.length ? (
          <div className={styles.tokenWrap}>
            {this.state.list?.map(item => {
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
                  tokenID={item.token_id}
                  isForceVisible={true}
                  isLike={false}
                  controlBtn={
                    this.isTokenAdded(item.token_id) ? (
                      <ButtonView
                        text={`Remove`}
                        onClick={() => { this.removeTokenFromCollection(item.token_id); }}
                        color={buttonColors.redButton}
                        customClass={`min-w-100px ${styles.buttonSecondControls}`}
                      />
                    ) : (
                      <ButtonView
                        text={`Add to collection`}
                        onClick={() => { this.addTokenFromCollection(item.token_id) }}
                        color={buttonColors.goldFill}
                        customClass={`min-w-100px ${styles.buttonSecondControls}`}
                      />
                    )
                  }
                />
              );
            })}
          </div>
          ) : (
            <EmptyListView />
          )
        }
        </>
      </ModalSample>
    );
  }
}

export default withComponent(ModalCollectionToken);
