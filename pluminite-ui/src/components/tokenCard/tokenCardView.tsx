import React, { ChangeEvent, Component } from 'react';
import styles from './tokenCardView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import LikeView, { LikeViewType } from '../like/likeView';
import { NavLink } from 'react-router-dom';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { convertNearToYoctoString, showToast } from '../../utils/sys';
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
}

type stateTypes = {
  isLike: boolean;
  likesCount: number;
  modalTransferIsShow: boolean;
  modalConfirmRemoveSaleShow: boolean;
  modalSaleShow: boolean;
};

class TokenCardView extends Component<Readonly<ITokenCardView & IBaseComponentProps>> {
  public state: stateTypes = {
    isLike: this.props.isLike,
    likesCount: this.props.likesCount || 0,
    modalConfirmRemoveSaleShow: false,
    modalTransferIsShow: false,
    modalSaleShow: false,
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

  public componentDidUpdate() {
    this.props.isForceVisible && forceVisible();
  }

  private get isMyToken() {
    return this.props.model.owner_id === this.props.near.user?.accountId;
  }

  private get icon() {
    return this.props.icon || cardPreview;
  }

  private get tokenID() {
    return this.props.tokenID;
  }

  private get tokenData() {
    return this.props.model;
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
    return this.props.model;
  }

  private onClick() {
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
    this._eTargetSwitch = e.target;

    if (e.target.checked) {
      this.modalToggleVisibility({ modalSaleShow: true });
    } else {
      this.modalToggleVisibility({ modalConfirmRemoveSaleShow: true });
    }
  }

  private getCardControls() {
    switch (this.typeView) {
      case TokensType.created:
      case TokensType.fixedPrice:
        return (
          <div className={styles.cardFooter}>
            <div className={styles.cardInfo}>
              {this.props.linkTo ? (
                <NavLink to={this.props.linkTo}>
                  <div className={styles.infoName}>{this.props.name}</div>
                </NavLink>
              ) : (
                <div className={styles.infoName}>{this.props.name}</div>
              )}
              <div className={styles.authorName}>{this.props.author}</div>
            </div>

            <div className={styles.cardControls}>
              <LikeView
                customClass={styles.likes}
                isChanged={this.state.isLike}
                isActive={true}
                type={LikeViewType.like}
                count={this.state.likesCount}
                onClick={this.toggleLikeToken}
              />
              {this.props.buttonText && <ButtonView
                text={this.isMyToken ? 'Sell' : this.props.buttonText}
                onClick={() => {
                  if (this.isMyToken) {
                    this.modalToggleVisibility({ modalSaleShow: true })
                  } else {
                    this.onClick();
                  }
                }}
                color={buttonColors.goldFill}
                customClass={styles.buttonSecondControls}
                disabled={this.typeView === TokensType.fixedPrice}
              />}
            </div>
          </div>
        );
      case TokensType.timedAuction:
      case TokensType.unlimitedAuction:
        return (
          <div className={`${styles.cardFooter} flex-column`}>
            <div className={'d-flex align-items-center justify-content-between w-100'}>
              <div className={styles.cardInfo}>
                {this.props.linkTo ? (
                  <NavLink to={this.props.linkTo}>
                    <div className={styles.infoName}>{this.props.name}</div>
                  </NavLink>
                ) : (
                  <div className={styles.infoName}>{this.props.name}</div>
                )}
                <div className={styles.authorName}>{this.props.author}</div>
              </div>

              <div className={`${styles.cardControls} justify-content-start`}>
                <LikeView
                  customClass={styles.likes}
                  isChanged={this.state.isLike}
                  isActive={true}
                  type={LikeViewType.like}
                  count={this.state.likesCount}
                  onClick={this.toggleLikeToken}
                />

                <p className={`${styles.priceText} pr-5px`}>Price {this.props.price || 0.00} NEAR</p>
              </div>
            </div>

            {this.isMyToken && (
              <>
                <p className='line-separator' />

                <div className='d-flex align-items-center justify-content-between w-100'>
                  <ButtonView
                    text={`Edit lot`}
                    onClick={() => {
                    }}
                    color={buttonColors.goldFill}
                    customClass={styles.buttonSecondControls}
                    disabled={true}
                  />
                  <ButtonView
                    text={`Stop selling`}
                    onClick={() => {
                      this.modalToggleVisibility({ modalConfirmRemoveSaleShow: true });
                    }}
                    color={buttonColors.redButton}
                    customClass={styles.buttonSecondControls}
                  />
                </div>
              </>
            )}
          </div>
        );
    }
  }

  private transferAction() {
    this.modalToggleVisibility({ modalTransferIsShow: true });
  }

  private modalToggleVisibility(data: object) {
    // data === { modalStateKeyIsShow: true }

    this.setState({
      ...this.state,
      ...data,
    });
  }

  private getContent() {
    return (
      <div
        className={`${styles.card} ${this.isSmall ? styles.cardSmall : ''} ${this.props.customClass ? this.props.customClass : ''} ${this.props.isView ? styles.onlyViewed : ''}`}>
        <div className={styles.cardImage}>
          {this.props.linkTo ? (
            <NavLink to={this.props.linkTo}>
              <MediaView customClass={styles.imageStyle} key={`media-${this.props.model.token_id}`}
                         model={this.props.model} />
            </NavLink>
          ) : (
            <MediaView customClass={styles.imageStyle} key={`media-${this.props.model.token_id}`}
                       model={this.props.model} />
          )}

          <div className={styles.cardDetail}>
            {(this.props.countL > 0 || this.props.countR > 0) && (
              <div className={styles.count}>
                {this.props.countL}/{this.props.countR}
              </div>
            )}

            {this.props.days !== '' && this.props.days !== null && (
              <div className={styles.daysInfo}>
                {this.props.days}
              </div>
            )}
          </div>

          {this.typeView === TokensType.created && this.isMyToken && !this.props.isView && (
            <ButtonView
              text={''}
              icon={transferIcon}
              withoutText={true}
              onClick={() => {
                this.transferAction();
              }}
              color={buttonColors.goldFill}
              customClass={styles.btnTransfer}
            />
          )}
        </div>

        {this.getCardControls()}

        {this.isMyToken && (
          <div className={styles.puOnMarketplaceWrap}>
            <p className='line-separator' />
            <div className={`d-flex align-items-center justify-content-between w-100 mt-2`}>
              <Form className='w-100'>
                <FormCheck.Label className='w-100'>
                  <div
                    className={`d-flex align-items-center w-100 cursor-pointer justify-content-between ${styles.putOnMarketplaceWrap}`}>
                    <div>
                      <p className={styles.toggleTitle}>Put on marketplace</p>
                    </div>

                    <Form.Check
                      checked={this.typeView !== TokensType.created}
                      type='switch'
                      className={styles.customFormCheck}
                      label=''
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        this.onToggleSale(e);
                      }}
                    />
                  </div>
                </FormCheck.Label>
              </Form>
            </div>
          </div>
        )}
      </div>
    );
  }

  public render() {
    return (
      <>
        {this.props.isView ? (
          this.getContent()
        ) : (
          <LazyLoad
            unmountIfInvisible={true}
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

        {this.typeView === TokensType.created ? (
          <>
            <ModalTransferNFT
              inShowModal={this.state.modalTransferIsShow}
              onHideModal={() => this.modalToggleVisibility({ modalTransferIsShow: false })}
              onSubmit={() => {
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
              onSubmit={({ saleType, price, start_date, end_date, }: { saleType: number, price?: number, start_date?: any, end_date?: any }) => {
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
                  console.log('sale_create', res);
                });
              }}
              tokenInfo={this.model}
            />
          </>
        ) : (
          <ModalConfirm
            inShowModal={this.state.modalConfirmRemoveSaleShow}
            onHideModal={() => {
              if (this._eTargetSwitch) this._eTargetSwitch.checked = true;
              this.modalToggleVisibility({ modalConfirmRemoveSaleShow: false });
            }}
            onSubmit={() => {
              this.modalToggleVisibility({ modalConfirmRemoveSaleShow: false });

              this.props.nftContractContext.sale_remove(this.model.token_id).then(res => {
                console.log('sale_remove', res);
              });
            }}
            confirmText={`Do you want to withdraw the token from sale?`}
          />
        )}
      </>
    );
  }
}

export default withComponent(TokenCardView);
export type { ITokenCardView };
