import React, { Component } from 'react';
import styles from './tokenCardView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import LikeView, { LikeViewType } from '../like/likeView';
import { NavLink } from 'react-router-dom';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { showToast } from '../../utils/sys';
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
};

class TokenCardView extends Component<Readonly<ITokenCardView & IBaseComponentProps>> {
  public state: stateTypes = {
    isLike: this.props.isLike,
    likesCount: this.props.likesCount || 0,
    modalTransferIsShow: false,
  };

  private readonly isSmall: boolean;
  private _isProcessLike: boolean;
  private readonly _refImage: React.RefObject<HTMLImageElement>;
  private _radioNFTApproveRef: any;

  constructor(props: ITokenCardView & IBaseComponentProps) {
    super(props);
    this.isSmall = this.props?.isSmall || false;
    this._isProcessLike = false;

    this._refImage = React.createRef();
  }

  public componentDidUpdate() {
    this.props.isForceVisible && forceVisible();
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
        return TokensType.fixedPrice
      case 2:
        return TokensType.timedAuction
      case 3:
        return TokensType.unlimitedAuction
    }
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
    }
    catch (ex) {
      this.changeLikeCount();

      showToast({
        message: `Error! Please try again later`,
        type: EShowTost.error,
      });
    }
    finally {
      this._isProcessLike = false;
    }
  };

  public setDefaultImage = () => {
    if (this._refImage.current) {
      this._refImage.current.src = cardPreview;
    }
  };

  private getCardControls() {
    switch (this.typeView) {
      case TokensType.created:
      case TokensType.fixedPrice:
        return (
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
              text={this.typeView === TokensType.created ? 'Sell' : this.props.buttonText}
              onClick={() => {
                this.onClick();
              }}
              color={buttonColors.goldFill}
              customClass={styles.buttonSecondControls}
              disabled={this.typeView === TokensType.fixedPrice}
            />}
          </div>
        );
      case TokensType.timedAuction:
        return (
          <>
            <div className={styles.cardControls}>
              <LikeView
                customClass={styles.likes}
                isChanged={this.state.isLike}
                isActive={true}
                type={LikeViewType.like}
                count={this.state.likesCount}
                onClick={this.toggleLikeToken}
              />
              <p className={styles.priceText}>Price {this.props.price || 0.00} NEAR</p>
            </div>

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
                }}
                color={buttonColors.redButton}
                customClass={styles.buttonSecondControls}
              />
            </div>
          </>
        );
      case TokensType.unlimitedAuction:
        return (
          <>
            <div className={styles.cardControls}>
              <LikeView
                customClass={styles.likes}
                isChanged={this.state.isLike}
                isActive={true}
                type={LikeViewType.like}
                count={this.state.likesCount}
                onClick={this.toggleLikeToken}
              />
              <p className={styles.priceText}>5/5 Sale on marketplace</p>
            </div>

            <p className='line-separator' />

            <div className='d-flex align-items-center justify-content-between w-100'>
              <Form className='w-100'>
                <FormCheck.Label className='w-100'>
                  <div
                    className={`d-flex align-items-center w-100 cursor-pointer justify-content-between ${styles.putOnMarketplaceWrap}`}>
                    <div>
                      <p className={styles.toggleTitle}>Put on marketplace</p>
                    </div>

                    <Form.Check
                      type='switch'
                      className={styles.customFormCheck}
                      label=''
                      ref={this._radioNFTApproveRef}
                    />
                  </div>
                </FormCheck.Label>
              </Form>
            </div>
          </>
        );
    }
  }

  private transferAction() {
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

  public render() {
    return (
      <>
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
          <div
            className={`${styles.card} ${this.isSmall ? styles.cardSmall : ''} ${this.props.customClass ? this.props.customClass : ''} ${this.props.isView ? styles.onlyViewed : ''}`}>
            <div className={styles.cardImage}>
              {this.props.linkTo ? (
                <NavLink to={this.props.linkTo}>
                  {/*<img className={styles.imageStyle} src={this.icon}*/}
                  {/*     onError={this.setDefaultImage} ref={this._refImage}*/}
                  {/*     alt={this.props.alt || 'preview image'} />*/}
                  <MediaView customClass={styles.imageStyle} key={`media-${this.props.model.token_id}`} model={this.props.model} />
                </NavLink>
              ) : (
                //<img onError={this.setDefaultImage} ref={this._refImage} className={styles.imageStyle} src={this.icon}
                //     alt={this.props.alt || 'preview image'} />
                <MediaView customClass={styles.imageStyle} key={`media-${this.props.model.token_id}`} model={this.props.model} />
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

              {this.typeView === TokensType.created && (
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

              {this.getCardControls()}

            </div>
          </div>
        </LazyLoad>

        {this.typeView === TokensType.created && (
          <>
            <ModalTransferNFT
              inShowModal={this.state.modalTransferIsShow}
              onHideModal={() => this.hideModal()}
              onSubmit={() => {
              }}
              tokenInfo={{}}
            />

            <ModalSaleToken
              inShowModal={false}
              onHideModal={() => {
              }}
              onSubmit={() => {
              }}
              tokenInfo={{}}
            />
          </>
        )}
      </>
    );
  }
}

export default withComponent(TokenCardView);
export type { ITokenCardView };
