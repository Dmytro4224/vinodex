import { ChangeEvent, Component } from 'react';
import styles from './tokenViewDetail.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import { ITokenCardView } from '../tokenCard/tokenCardView';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import LikeView, { LikeViewType } from '../like/likeView';
import ArtistCard, { ArtistType } from '../artistCard/ArtistCard';
import { Badge, Form, FormCheck, Tab, Tabs } from 'react-bootstrap';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import DescrtiptionView from '../description/descrtiptionView';
import TokenDetailView from './tabs/detail/tokenDetailView';
import BidsView from './tabs/bids/bidsView';
import HistoryView from './tabs/history/historyView';
import OwnersView from './tabs/owners/ownersView';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import Skeleton from 'react-loading-skeleton';
import SimilarTokensView from '../../components/similarTokens/similarTokensView';
import React from 'react';
import {
  convertNearToYoctoString,
  convertYoctoNearsToNears,
  isVideoFile,
  showToast,
} from '../../utils/sys';
import { EShowTost } from '../../types/ISysTypes';
import ModalTokenCheckoutNFT from '../modals/modalTokenCheckoutNFT/ModalTokenCheckoutNFT';
import ModalViewMedia from '../modals/modalViewMedia/ModalViewMedia';
import { TokensType } from '../../types/TokenTypes';
import ModalConfirm from '../modals/modalConfirm/ModalConfirm';
import ModalSaleToken from '../modals/modalSaleToken/ModalSaleToken';

interface ITokenViewDetail extends IProps {
  hash?: string;
}

interface ICategory extends IProps {
  text: string;
}

class Category extends Component<ICategory & IBaseComponentProps, {}, any> {
  constructor(props: ICategory & IBaseComponentProps) {
    super(props);
  }

  private get text() {
    return this.props.text;
  }

  render() {
    return (
      <div className={styles.category}>{this.text}</div>
    );
  }
}

const CategoryView = withComponent(Category);

interface ITokenViewState {
  order?: ITokenResponseItem | null;
  isLoading: boolean;
  isLike: boolean;
  likesCount: number;
  modalTransferIsShow: boolean;
  modalMediaShow: boolean;
  modalSaleShow: boolean;
  creator: any;
  isShowConfirmModal: boolean,
  modalConfirmData: {
    text: string,
    confirmCallback: () => void,
  }
}

class TokenViewDetail extends Component<ITokenViewDetail & IBaseComponentProps, ITokenViewState, any> {
  public state: ITokenViewState = {
    order: null,
    isLoading: true,
    isLike: false,
    likesCount: 0,
    modalTransferIsShow: false,
    modalSaleShow: false,
    modalMediaShow: false,
    creator: null,
    isShowConfirmModal: false,
    modalConfirmData: {
      text: '',
      confirmCallback: () => {
      },
    }
  };

  private readonly _refImage: React.RefObject<HTMLImageElement>;
  private _isProcessLike: boolean;
  private _eTargetSwitch: any;

  constructor(props: ITokenViewDetail & IBaseComponentProps) {
    super(props);

    this._isProcessLike = false;
    this._refImage = React.createRef();
  }

  public componentDidMount() {
    window.scrollTo(0, 0);
    this.getInfo();
  }

  public componentDidUpdate(prevProps: any, prevState: any) {
    if (prevProps.params.tokenId !== this.tokenId) {
      window.scrollTo(0, 0);
      this.getInfo();
    }
  }

  private getInfo() {
    this.props.nftContractContext.nft_token_get(this.tokenId).then(response => {
      console.log(`response d`, response);
      this.setState({
        ...this.state,
        order: response,
        isLoading: false,
        isLike: response.is_like,
        likesCount: response.metadata.likes_count,
      });
    });
  }

  private get isAuth() {
    return this.props.near.isAuth;
  }

  private get tokenId() {
    return this.props.params.tokenId!;
  }

  private get isVideo() {
    let extra = JSON.parse(this.state.order?.metadata.extra);

    if (extra) {
      return isVideoFile(extra.media_type);
    }

    return false;
  }

  public setDefaultImage = async () => {
    if (this._refImage.current) {
      this._refImage.current.src = cardPreview;
    }
  };

  public changeLikeCount() {
    this.setState({
      ...this.state,
      isLike: !this.state.isLike,
      likesCount: !this.state.isLike ? this.state.likesCount + 1 : this.state.likesCount - 1,
    });
  }

  private buyAction() {
    this.showModal();
  }

  private showModal() {
    this.setState({
      ...this.state,
      modalTransferIsShow: true,
    });
  }

  private hideModal() {
    this.setState({
      ...this.state,
      modalTransferIsShow: false,
    });
  }

  private showMediaModal() {
    this.setState({
      ...this.state,
      modalMediaShow: true,
    });
  }

  private hideMediaModal() {
    this.setState({
      ...this.state,
      modalMediaShow: false,
    });
  }

  private toggleLikeToken = async () => {
    if (!this.props.near.isAuth) {
      this.props.near.signIn();
      return;
    }

    try {
      if (this._isProcessLike) {
        return;
      }

      this._isProcessLike = true;

      this.changeLikeCount();

      await this.props.nftContractContext.token_set_like(this.tokenId);

      this._isProcessLike = false;
    } catch (ex) {
      this._isProcessLike = false;

      this.changeLikeCount();

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error,
      });
    }
  };

  private get getUserId() {
    return this.state.order?.owner_id;
  }

  private getCreatorData() {
    if (!this.getUserId) {
      return;
    }

    this.props.nftContractContext.getProfile(this.getUserId).then(profile => {
      if (profile) {
        console.log(`response profile`, profile);
        this.setState({ ...this.state, creator: profile });
      }
    });
  }

  private get typeView() {
    if (!this.state.order || !this.state.order?.sale) return TokensType.created;

    switch (this.state.order.sale.sale_type) {
      case 1:
        return TokensType.fixedPrice;
      case 2:
        return TokensType.timedAuction;
      case 3:
        return TokensType.unlimitedAuction;
    }
  }

  private get isMyToken() {
    return this.state.order?.owner_id === this.props.near.user?.accountId;
  }

  private modalToggleVisibility(data: object) {
    this.setState({
      ...this.state,
      ...data,
    });
  }

  private onToggleSale(isSaleAction: boolean) {
    if (isSaleAction) {
      this.modalToggleVisibility({ modalSaleShow: true });
    } else {
      this.modalToggleVisibility({
        isShowConfirmModal: true,
        modalConfirmData: {
          text: 'Do you want to withdraw the token from sale?',
          confirmCallback: () => {
            if (this.state.order?.token_id) {
              this.props.nftContractContext.sale_remove(this.state.order.token_id).then(res => {
                this.getInfo();
                console.log('sale_remove', res);
              });
            }
          },
        },
      });
    }
  }

  private getCardControls() {
    const price = convertYoctoNearsToNears(this.state.order?.sale?.price) || 0.00;

    switch (this.typeView) {
      case TokensType.created:
        return (
          <>
            {this.isMyToken ? (
              <ButtonView
                text={'Put on marketplace'}
                onClick={() => {
                  if (!this.isAuth) {
                    this.props.near.signIn();
                    return;
                  }

                  this.onToggleSale(true);
                }}
                color={buttonColors.goldFill}
                customClass={styles.button}
              />
            ) : (
              <ButtonView
                text={'Not for sale'}
                onClick={() => {
                }}
                color={buttonColors.goldFill}
                customClass={styles.button}
                disabled={true}
              />
            )}
          </>
        );
      case TokensType.fixedPrice:
        return (
          <>
            {this.isMyToken ? (
              <ButtonView
                text={`Stop selling`}
                onClick={() => {
                  if (!this.isAuth) {
                    this.props.near.signIn();
                    return;
                  }

                  this.onToggleSale(false);
                }}
                color={buttonColors.redButton}
                customClass={styles.button}
              />
            ) : (
              <ButtonView
                text={`Buy now ${convertYoctoNearsToNears(this.state.order?.sale.price)} NEAR`}
                onClick={() => {
                  if (!this.isAuth) {
                    this.props.near.signIn();
                    return;
                  }

                  this.buyAction();
                }}
                color={buttonColors.goldFill}
                customClass={styles.button}
              />
            )}
          </>
        );
      case TokensType.timedAuction:
      case TokensType.unlimitedAuction:
        return (
          <>
            {this.state.order?.sale?.is_closed ? (
              this.isMyToken ? (
                <ButtonView
                  text={`Start auction`}
                  onClick={() => {
                    if (!this.isAuth) {
                      this.props.near.signIn();
                      return;
                    }

                    this.modalToggleVisibility({
                      isShowConfirmModal: true,
                      modalConfirmData: {
                        text: 'Do you want to start an auction?',
                        confirmCallback: () => {
                          this.props.nftContractContext.sale_set_is_closed(this.state.order?.token_id!, false)
                            .then(res => {
                              console.log('sale_set_is_closed', res);
                              this.getInfo();
                            })
                            .catch(error => {
                              console.error('sale_set_is_closed', error);
                              showToast({
                                message: error,
                                type: EShowTost.error
                              })
                            })
                        },
                      },
                    });
                  }}
                  color={buttonColors.greenButton}
                  customClass={styles.button}
                />
              ) : (
                this.state.order?.sale?.bids[0]?.account?.account_id === this.props.near.user?.accountId ? (
                  <ButtonView
                    text={`Get the lot`}
                    onClick={() => {
                      if (!this.isAuth) {
                        this.props.near.signIn();
                        return;
                      }

                      this.modalToggleVisibility({
                        isShowConfirmModal: true,
                        modalConfirmData: {
                          text: 'Do you want to get the lot?',
                          confirmCallback: () => {
                            const time = new Date().getTime();
                            const price = this.state.order?.sale && this.state.order?.sale.bids.length !== 0 ? this.state.order?.sale?.bids[this.state.order?.sale.bids.length - 1].price : null;

                            this.props.nftContractContext.sale_auction_init_transfer(this.state.order?.token_id!, time, price)
                              .then(res => {
                                console.log('sale_auction_init_transfer', res);
                                this.getInfo();
                              })
                              .catch(error => {
                                console.error('sale_auction_init_transfer', error);
                                showToast({
                                  message: error,
                                  type: EShowTost.error
                                })
                              })
                          },
                        },
                      });
                    }}
                    color={buttonColors.goldFill}
                    customClass={styles.button}
                  />
                ) : (
                  <ButtonView
                    text={`Auction is closed`}
                    onClick={() => {}}
                    color={buttonColors.goldFill}
                    customClass={styles.button}
                    disabled={true}
                  />
                )
              )
            ) : (
              this.isMyToken ? (
                <ButtonView
                  text={`Stop auction`}
                  onClick={() => {
                    if (!this.isAuth) {
                      this.props.near.signIn();
                      return;
                    }

                    this.modalToggleVisibility({
                      isShowConfirmModal: true,
                      modalConfirmData: {
                        text: 'Do you want to stop the auction right now?',
                        confirmCallback: () => {
                          this.props.nftContractContext.sale_set_is_closed(this.state.order?.token_id!, true)
                            .then(res => {
                              console.log('sale_set_is_closed', res);
                              this.getInfo();
                            })
                            .catch(error => {
                              console.error('sale_set_is_closed', error);
                              showToast({
                                message: 'Can not close sale without bids',
                                type: EShowTost.error
                              })
                            })
                        },
                      },
                    });
                  }}
                  color={buttonColors.redButton}
                  customClass={styles.button}
                />
              ) : (
                <ButtonView
                  text={`Place a bid ${price > 0 ? `${price} NEAR` : ``}`}
                  onClick={() => {
                    if (!this.isAuth) {
                      this.props.near.signIn();
                      return;
                    }

                    this.buyAction();
                  }}
                  color={buttonColors.goldFill}
                  customClass={styles.button}
                />
              )
            )}
          </>
        );
    }
  }

  private get price() {
    return convertYoctoNearsToNears(this.state.order?.sale?.price) || 0.00;
  }

  render() {
    if (this.state.isLoading) {
      return <div className={`d-flex align-items-center flex-gap-36 p-5 ${styles.scrollWrap}`}>
        <div className='w-100'><Skeleton count={1} height={300} /></div>
        <div className='w-100 flex-column'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
      </div>;
    }

    return (
      <>
        <div>
          <div className={`d-flex flex-gap-36 container ${styles.mainWrap}`}>
            <div className={styles.cardImage}>
              <div className={styles.cardImageWrap}>
                {this.isVideo ?
                  <iframe
                    className={styles.iFrameStyle} width='1000' height='600'
                    src={this.state.order?.metadata.media || cardPreview}
                    title='' frameBorder='0'
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen />
                  :
                  <img
                    onClick={() => {
                      this.showMediaModal();
                    }}
                    ref={this._refImage}
                    onError={this.setDefaultImage}
                    className={styles.imageStyle}
                    src={this.state.order?.metadata.media || cardPreview}
                    alt={'preview image'}
                  />
                }
                <div className={styles.cardDetail}>
                  {(this.state.order?.metadata.expires_at! !== '' && this.state.order?.metadata.expires_at !== null) &&
                    <div className={styles.daysInfo}>
                      {this.state.order?.metadata.expires_at}
                    </div>}
                </div>
              </div>
            </div>
            <div className={styles.tokenInfo}>
              <h3 className={styles.tokenTitle}>{this.state.order?.metadata.title}</h3>
              <p className={'mt-2 mb-1 fz-15'}>Collection: <strong>{this.state.order?.token_type}</strong></p>

              <div className={`d-flex align-items-center justify-content-between w-100`}>
                <p className={`fz-18`}>Available items: <strong>1/1</strong></p>

                <div className={`d-flex align-items-center gap-15px`}>
                  <div className={styles.counterWrapStyle}>
                    <LikeView
                      customClass={styles.likes}
                      isActive={true}
                      type={LikeViewType.eye}
                      count={0}
                      isChanged={false}
                    />
                  </div>
                  <div className={styles.counterWrapStyle}>
                    <LikeView
                      customClass={styles.likes}
                      isActive={true}
                      type={LikeViewType.like}
                      isChanged={this.state.isLike}
                      onClick={this.toggleLikeToken}
                      count={this.state.likesCount}
                    />
                  </div>
                </div>
              </div>

              <div className={`${styles.artistsWrap} d-flex align-items-center flex-gap-36 mt-3`}>
                <ArtistCard
                  info={{
                    bio: '',
                    email: '',
                    image: '',
                    name: this.state.order?.creator_id || 'Creator name',
                    account_id: '',
                    likes_count: 0,
                    is_like: false,
                    is_following: false,
                    followers_count: 0,
                  }}
                  identification={this.state.order?.creator_id!}
                  usersCount={0}
                  likesCount={0}
                  title={'Creator'}
                  type={ArtistType.info}
                  isFollow={false}
                  isLike={false}
                  withoutControls={true}
                />
                <ArtistCard
                  info={{
                    bio: '',
                    email: '',
                    image: '',
                    name: this.state.order?.metadata?.artist || 'Artist name',
                    account_id: '',
                    likes_count: 0,
                    is_like: false,
                    is_following: false,
                    followers_count: 0,
                  }}
                  identification={this.state.order?.creator_id!}
                  usersCount={0}
                  likesCount={0}
                  title={'Artist'}
                  type={ArtistType.info}
                  isFollow={false}
                  isLike={false}
                  withoutControls={true}
                />
              </div>

              <div className={`my-4`}>
                <div className={`${styles.tokenInformationWrap} my-3`}>
                  <div className='w-100'>
                    <ul className={styles.specList}>
                      <li>
                        <p>Year</p>
                        <p className={styles.infoLine} />
                        <p>{new Date(this.state.order?.metadata.year || '').getFullYear()}</p>
                      </li>

                      <li>
                        <p>Volume (cl)</p>
                        <p className={styles.infoLine} />
                        <p>{this.state.order?.metadata.botle_size || 0}cl</p>
                      </li>
                      <li>
                        <p>Style</p>
                        <p className={styles.infoLine} />
                        <p>{this.state.order?.metadata.style}</p>
                      </li>
                    </ul>
                  </div>
                </div>

                <DescrtiptionView text={this.state.order?.metadata.description!} />
              </div>

              <div className={`my-4 ${styles.priceWrap}`}>
                <p>Price</p>
                <p><strong>{this.price && this.price > 0 ? `${this.price} NEAR` : '— NEAR'}</strong></p>
              </div>

              <div className={styles.buttonWrap}>
                {this.getCardControls()}
              </div>
            </div>
          </div>

          {(this.state.order?.metadata.specification || this.state.order?.metadata.characteristics) ? (
            <div className='w-100 container mt-5'>
              <div className={styles.tokenInformationWrap}>
                {this.state.order?.metadata.specification && (
                  <div className={`${styles.specList} w-100`}>
                    <p className={styles.infoTitle}>Specifications</p>

                    {/* replaceAll for test */}
                    <div dangerouslySetInnerHTML={{ __html: this.state.order?.metadata.specification.replaceAll('<span />', '<span></span>') || '' }} />
                  </div>
                )}
                {this.state.order?.metadata.characteristics && (
                  <div className={`${styles.infoList} w-100`}>
                    <p className={styles.infoTitle}>Information</p>

                    <div dangerouslySetInnerHTML={{ __html: this.state.order?.metadata.characteristics || '' }} />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <p className='separator-horizontal mt-5' />
          )}

          <div className='container my-5'>
            <SimilarTokensView />
          </div>
        </div>

        <ModalTokenCheckoutNFT
          inShowModal={this.state.modalTransferIsShow}
          onHideModal={() => this.hideModal()}
          onSubmit={() => {
            this.getInfo();
          }}
          tokenInfo={{}} token={this.state.order || null} />
        {!this.isVideo ? <ModalViewMedia
          inShowModal={this.state.modalMediaShow}
          onHideModal={() => this.hideMediaModal()}
          media={{ src: this.state.order?.metadata.media || cardPreview }}
        /> : ''}

        <ModalSaleToken
          inShowModal={this.state.modalSaleShow}
          onHideModal={() => {
            this.modalToggleVisibility({ modalSaleShow: false });
            if (this._eTargetSwitch) this._eTargetSwitch.checked = false;
          }}
          onSubmit={({ saleType, price, start_date, end_date }: { saleType: number, price?: number, start_date?: any, end_date?: any }) => {
            const convertedPrice = price ? convertNearToYoctoString(price) : null;

            const result = {
              token_id: this.state.order?.token_id,
              sale_type: saleType,
              price: convertedPrice || '',
              startDate: start_date ? new Date(start_date).getTime() : '',
              endDate: end_date ? new Date(end_date).getTime() : '',
            };

            console.table(result);

            this.props.nftContractContext.sale_create(
              this.state.order?.token_id || '',
              saleType,
              result.price,
              result.startDate,
              result.endDate,
            ).then(res => {
              this.modalToggleVisibility({ modalSaleShow: false });
              this.getInfo();
            });
          }}
          tokenInfo={this.state.order}
        />

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
      </>
    );
  }
}

export default withComponent(TokenViewDetail);

// <div className={styles.tabsWrap}>
//   <Tabs
//     id='controlled-tab-example'
//     className='mb-3'
//   >
//     <Tab eventKey='home' title='DESCRIPTION'>
//       <div className={styles.tabContainer}>
//         <DescrtiptionView text={this.state.order?.metadata.description!} />
//       </div>
//     </Tab>
//     <Tab eventKey='profile' title='DETAILS'>
//       <div className={styles.tabContainer}>
//         <TokenDetailView address={'Contract Address'} id={this.state.order?.token_id!} />
//       </div>
//     </Tab>
//     {this.state.order?.sale !== null && (this.state.order?.sale.sale_type === 2 || this.state.order?.sale.sale_type === 3 ?
//       <Tab eventKey='bids' title='BIDS'>
//         <div className={styles.tabContainer}>
//           <BidsView tokenId={this.state.order?.token_id!} />
//         </div>
//       </Tab> : '')}
//     <Tab eventKey='contact' title='HISTORY'>
//       <div className={styles.tabContainer}>
//         <HistoryView tokenId={this.state.order?.token_id!} />
//       </div>
//     </Tab>
//     <Tab eventKey='owners' title='OWNERS'>
//       <div className={styles.tabContainer}>
//         <OwnersView tokenId={this.state.order?.token_id!} />
//       </div>
//     </Tab>
//   </Tabs>
// </div>
