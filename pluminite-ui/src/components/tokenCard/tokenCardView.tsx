import React, { ChangeEvent, Component } from 'react';
import styles from './tokenCardView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import LikeView, { LikeViewType } from '../like/likeView';
import { NavLink } from 'react-router-dom';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { convertNearToYoctoString, convertYoctoNearsToNears, showToast } from '../../utils/sys';
import { EShowTost } from '../../types/ISysTypes';
import transferIcon from '../../assets/icons/transfer-icon.svg';
import { Form, FormCheck } from 'react-bootstrap';
import ModalTransferNFT from '../modals/modalTransferNFT/ModalTransferNFT';
import ModalSaleToken from '../modals/modalSaleToken/ModalSaleToken';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import MediaView from '../media/MediaView';
import LazyLoad, { forceVisible } from 'react-lazyload';
import Skeleton from 'react-loading-skeleton';
import { TokensType } from '../../types/TokenTypes';
import ModalConfirm from '../modals/modalConfirm/ModalConfirm';
import ModalTokenCheckoutNFT from '../modals/modalTokenCheckoutNFT/ModalTokenCheckoutNFT';
import { Timer, TimerType } from '../common/timer/Timer';

interface ITokenCardView extends IProps {
  model: ITokenResponseItem;
  icon?: any;
  alt?: string;
  countL: number;
  countR: number;
  days: string;
  name: string;
  author: string;
  likesCount?: number;
  buttonText?: string;
  isSmall?: boolean;
  linkTo?: string;
  tokenID: string;
  isLike: boolean;
  customClass?: string;
  onClick?: () => void;
  price?: number;
  isView?: boolean;
  isForceVisible?: boolean;
  catalog?: string;
  containerName?: string;
}

type stateTypes = {
  isLike: boolean;
  likesCount: number;
  modalTransferIsShow: boolean;
  modalCeckoutIsShow: boolean;
  modalSaleShow: boolean;
  isFetch: boolean;
  model: ITokenResponseItem;
  isShowConfirmModal: boolean;
  modalConfirmData: any;
};

class TokenCardView extends Component<Readonly<ITokenCardView & IBaseComponentProps>> {
  public state: stateTypes = {
    isLike: this.props.isLike,
    likesCount: this.props.likesCount || 0,
    modalTransferIsShow: false,
    modalCeckoutIsShow: false,
    modalSaleShow: false,
    isFetch: false,
    model: this.props.model,
    isShowConfirmModal: false,
    modalConfirmData: {
      text: '',
      confirmCallback: () => {
      },
    },
  };

  private readonly isSmall: boolean;
  private _isProcessLike: boolean;
  private readonly _refImage: React.RefObject<HTMLImageElement>;
  private _radioNFTApproveRef: any;
  private _eTargetSwitch: any;

  constructor(props: ITokenCardView & IBaseComponentProps) {
    super(props);
    this.isSmall = this.props?.isSmall || false;
    this._isProcessLike = false;

    this._refImage = React.createRef();
  }

  private getInfo() {
    this.props.nftContractContext.nft_token_get(this.tokenID).then(response => {
      this.setState({
        ...this.state,
        isFetch: true,
        model: response,
      });
    });
  }

  public componentDidUpdate() {
    this.props.isForceVisible && forceVisible();
  }

  private get isAuth() {
    return this.props.near.isAuth;
  }

  private get isMyToken() {
    return this.state.model.owner_id === this.props.near.user?.accountId;
  }

  private get accountId() {
    return this.props.near.user?.accountId;
  }

  private get icon() {
    return this.props.icon || cardPreview;
  }

  private get tokenID() {
    return this.props.tokenID;
  }

  private get tokenData() {
    return this.state.model;
  }

  private get typeView() {
    if (!this.tokenData || !this.tokenData?.sale) return TokensType.created;

    switch (this.tokenData.sale.sale_type) {
      case 1:
        return TokensType.fixedPrice;
      case 2:
        return TokensType.timedAuction;
      case 3:
        return TokensType.unlimitedAuction;
    }
  }

  private get model() {
    return this.state.model;
  }

  private onClick() {
    if (!this.isAuth) {
      this.props.near.signIn();
      return;
    }

    this.props.onClick && this.props.onClick();
  }

  public changeLikeCount() {
    this.setState({
      ...this.state,
      isLike: !this.state.isLike,
      likesCount: !this.state.isLike ? this.state.likesCount + 1 : this.state.likesCount - 1,
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

      await this.props.nftContractContext.token_set_like(this.tokenID);
    } catch (ex) {
      this.changeLikeCount();

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error,
      });
    } finally {
      this._isProcessLike = false;
    }
  };

  public setDefaultImage = () => {
    if (this._refImage.current) {
      this._refImage.current.src = cardPreview;
    }
  };

  private onToggleSale(e: ChangeEvent<HTMLInputElement>) {
    if (!this.isAuth) {
      this.props.near.signIn();
      return;
    }

    this._eTargetSwitch = e.target;

    if (e.target.checked) {
      this.modalToggleVisibility({ modalSaleShow: true });
    } else {
      this.modalToggleVisibility({
        isShowConfirmModal: true,
        modalConfirmData: {
          text: 'Do you want to withdraw the token from sale?',
          confirmCallback: () => {
            this.props.nftContractContext.sale_remove(this.model.token_id).then(res => {
              console.log('sale_remove', res);

              this.modalToggleVisibility({ isShowConfirmModal: false });
              this.getInfo();
            });
          },
        },
      });
    }
  }

  private withdrawToken() {
    if (!this.isAuth) {
      this.props.near.signIn();
      return;
    }

    if (this.isMyToken) {
      if (this.typeView === TokensType.fixedPrice) {
        this.modalToggleVisibility({
          isShowConfirmModal: true,
          modalConfirmData: {
            text: 'Do you want to withdraw the token from sale?',
            confirmCallback: () => {
              this.props.nftContractContext.sale_remove(this.model.token_id).then(res => {
                console.log('sale_remove', res);

                this.modalToggleVisibility({ isShowConfirmModal: false });
                this.getInfo();
              });
            },
          },
        });
      } else {
        this.modalToggleVisibility({ modalSaleShow: true });
      }
    } else {
      this.onClick();
    }
  }

  private getCardControls() {
    const price = convertYoctoNearsToNears(this.state.model?.sale?.price) || 0.00;

    switch (this.typeView) {
      case TokensType.created:
      case TokensType.fixedPrice:
        return (
          <div className={styles.cardControls}>
            <div className={styles.priceWrap}>
              <span>Price</span>
              {price && price > 0 ? <p>{price}&nbsp;NEAR</p> : <p>—</p>}
            </div>

            {this.isMyToken ? this.props.buttonText && (
              <ButtonView
                text={this.isMyToken ? this.typeView === TokensType.fixedPrice ? 'Stop selling' : 'Sell' : this.props.buttonText}
                onClick={() => { this.withdrawToken(); }}
                color={this.isMyToken && this.typeView === TokensType.fixedPrice ? buttonColors.redButton : buttonColors.goldFill}
                customClass={styles.buttonSecondControls}
              />
            ) : (this.typeView === TokensType.fixedPrice) ? (
              <ButtonView
                text={`Buy now`}
                onClick={() => { this.showCheckoutModal(); }}
                color={buttonColors.goldFill}
                customClass={styles.buttonSecondControls}
              />
            ) : (
              <ButtonView
                text={'Not for sale'}
                onClick={() => { }}
                color={buttonColors.goldFill}
                customClass={styles.buttonSecondControls}
                disabled={true} />
            )}
          </div>
        );
      case TokensType.timedAuction:
      case TokensType.unlimitedAuction:
        return (
          <div className={`${styles.cardControls}`}>
            <div className={styles.priceWrap}>
              <span>Price</span>
              {price && price > 0 ? <p>{price}&nbsp;NEAR</p> : <p>—</p>}
            </div>

            {this.model.sale?.is_closed ? (
              this.isMyToken ? (
                <ButtonView
                  text={`Start auction`}
                  onClick={() => {
                    this.modalToggleVisibility({
                      isShowConfirmModal: true,
                      modalConfirmData: {
                        text: 'Do you want to start an auction?',
                        confirmCallback: () => {
                          this.props.nftContractContext.sale_set_is_closed(this.model.token_id, false)
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
                  customClass={styles.buttonSecondControls}
                />
              ) : (
                this.model.sale?.bids[0]?.account?.account_id === this.accountId ? (
                  <ButtonView
                    text={`Get the lot`}
                    onClick={() => {
                      this.modalToggleVisibility({
                        isShowConfirmModal: true,
                        modalConfirmData: {
                          text: 'Do you want to get the lot?',
                          confirmCallback: () => {
                            const time = new Date().getTime();
                            const price = this.model.sale && this.model.sale.bids.length !== 0 ? this.model.sale?.bids[this.model.sale.bids.length - 1].price : null;

                            this.props.nftContractContext.sale_auction_init_transfer(this.model.token_id, time, price)
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
                    customClass={styles.buttonSecondControls}
                  />
                ) : (
                  <ButtonView
                    text={`Auction is closed`}
                    onClick={() => { }}
                    color={buttonColors.goldFill}
                    customClass={styles.buttonSecondControls}
                    disabled={true}
                  />
                )
              )
            ) : (
              this.isMyToken ? (
                <ButtonView
                  text={`Stop auction`}
                  onClick={() => {
                    if (!this.state.model?.sale?.bids?.length) {
                      showToast({
                        message: 'Can not close auction without bids',
                        type: EShowTost.warning
                      })

                      return;
                    }

                    this.modalToggleVisibility({
                      isShowConfirmModal: true,
                      modalConfirmData: {
                        text: 'Do you want to stop the auction right now?',
                        confirmCallback: () => {
                          this.props.nftContractContext.sale_set_is_closed(this.model.token_id, true)
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
                  customClass={styles.buttonSecondControls}
                />
              ) : (
                <ButtonView
                  text={`Place a bid ${price > 0 ? `${price} NEAR` : ``}`}
                  onClick={() => { this.showCheckoutModal(); }}
                  color={buttonColors.goldFill}
                  customClass={styles.buttonSecondControls}
                />
              )
            )}
          </div>
        );
    }
  }

  private transferAction() {
    this.modalToggleVisibility({ modalTransferIsShow: true });
  }

  private modalToggleVisibility(data: object) {
    if (!this.isAuth) {
      this.props.near.signIn();
      return;
    }

    this.setState({
      ...this.state,
      ...data,
    });
  }

  private getContent() {
    return (
      <div
        className={`${styles.card} ${this.isSmall ? styles.cardSmall : ''} ${this.props.customClass ? this.props.customClass : ''} ${this.props.isView ? styles.onlyViewed : styles.isHover}`}>
        <div className={styles.cardImage}>
          {this.props.linkTo ? (
            <NavLink to={this.props.linkTo}>
              <MediaView
                customClass={styles.imageStyle}
                model={this.state.model} />
            </NavLink>
          ) : (
            <MediaView
              customClass={styles.imageStyle}
              model={this.state.model} />
          )}

          <div className={styles.cardDetail}>
            {(this.props.countL > 0 || this.props.countR > 0) && (
              <>
                <span>&nbsp;</span>
                <div className={styles.count}>
                  {this.props.countL}/{this.props.countR}
                </div>
              </>
            )}
          </div>

          <ButtonView
            text={`View Details`}
            onClick={() => { this.props.linkTo && this.props.navigate(this.props.linkTo) }}
            color={buttonColors.goldBordered}
            customClass={`${styles.button} ${styles.buttonDetails}`}
          />

          {this.state.model?.sale?.end_date && (
            <div className={styles.timerWrap}>
              <Timer
                type={TimerType.small}
                endDateTimestamp={this.state.model.sale.end_date}
              />
            </div>
          )}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.cardInfo}>
            <div className={styles.tokenName}>{this.model.metadata.title}</div>
            <div className={styles.authorName}>{this.model.owner_id}</div>
            {/*<div className={styles.tokenType}>{this.model.token_type}</div>*/}
          </div>

          {this.getCardControls()}
        </div>
      </div>
    );
  }

  private hideCheckoutModal() {
    this.setState({
      ...this.state,
      modalCeckoutIsShow: false,
    });
  }

  private showCheckoutModal() {
    if (!this.isAuth) {
      this.props.near.signIn();
      return;
    }

    this.setState({
      ...this.state,
      modalCeckoutIsShow: true,
    });
  }

  public render() {
    return (
      <>
        {this.props.isView ? (
          this.getContent()
        ) : (
          <LazyLoad
            unmountIfInvisible={false}
            height={200}
            placeholder={
              <div style={{ width: this.isSmall ? '296px' : '100%' }}>
                <Skeleton count={1} height={340} />
                <Skeleton count={3} />
              </div>
            }
            debounce={100}>
            {this.getContent()}
          </LazyLoad>
        )}

        {this.typeView === TokensType.created && (
          <>
            <ModalTransferNFT
              inShowModal={this.state.modalTransferIsShow}
              onHideModal={() => this.modalToggleVisibility({ modalTransferIsShow: false })}
              onSubmit={() => {
                this.getInfo();
                this.modalToggleVisibility({ modalTransferIsShow: false });
              }}
              tokenInfo={{}}
            />

            <ModalSaleToken
              inShowModal={this.state.modalSaleShow}
              onHideModal={() => {
                this.modalToggleVisibility({ modalSaleShow: false });
                if (this._eTargetSwitch) this._eTargetSwitch.checked = false;
              }}
              onSubmit={({ saleType, price, start_date, end_date }: { saleType: number, price?: number, start_date?: any, end_date?: any }) => {
                const convertedPrice = price ? convertNearToYoctoString(price) : null;

                const result = {
                  token_id: this.model.token_id,
                  sale_type: saleType,
                  price: convertedPrice || '',
                  startDate: start_date ? new Date(start_date).getTime() : '',
                  endDate: end_date ? new Date(end_date).getTime() : '',
                };

                console.table(result);

                this.props.nftContractContext.sale_create(
                  this.model.token_id,
                  saleType,
                  result.price,
                  result.startDate,
                  result.endDate,
                ).then(res => {
                  this.modalToggleVisibility({ modalSaleShow: false });
                  this.getInfo();

                  console.log('sale_create', res);
                });
              }}
              tokenInfo={this.model}
            />
          </>
        )}

        {(this.typeView !== TokensType.created && !this.isMyToken) && (
          <ModalTokenCheckoutNFT
            inShowModal={this.state.modalCeckoutIsShow}
            onHideModal={() => this.hideCheckoutModal()}
            onSubmit={() => {
              this.getInfo();
              this.hideCheckoutModal();
            }}
            tokenInfo={{}} token={this.model || null}
          />
        )}

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

export default withComponent(TokenCardView);
export type { ITokenCardView };

//   <ButtonView
//     text={''}
//     icon={transferIcon}
//     withoutText={true}
//     onClick={() => {
//       this.transferAction();
//     }}
//     color={buttonColors.goldFill}
//     customClass={styles.btnTransfer}
//   />
// )}
//

// <div className={`${styles.cardControls} justify-content-start`}>
//   <LikeView
//     customClass={styles.likes}
//     isChanged={this.state.isLike}
//     isActive={true}
//     type={LikeViewType.like}
//     count={this.state.likesCount}
//     onClick={this.toggleLikeToken}
//   />
//
//   {this.state.model?.sale && this.isMyToken && (
//     <p className={`${styles.priceText} pr-5px`}>{price} NEAR</p>
//   )}
// </div>
