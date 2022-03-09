import { Component } from 'react';
import styles from './tokenCardView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import LikeView, { LikeViewType } from '../like/likeView';
import { NavLink } from 'react-router-dom';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { showToast } from '../../utils/sys';
import { EShowTost } from '../../types/ISysTypes';
import React from 'react';
import { ProfileTokensType } from '../../types/ProfileTokenTypes';
import transferIcon from '../../assets/icons/transfer-icon.svg';
import { Form, FormCheck } from 'react-bootstrap';
import ModalTransferNFT from '../modals/modalTransferNFT/ModalTransferNFT';
import ModalSaleToken from '../modals/modalSaleToken/ModalSaleToken';

interface ITokenCardView extends IProps {
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
  typeView?: ProfileTokensType;
  price?: number;
  isTransferAction?: boolean;
  isView?: boolean;
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

  private get icon() {
    return this.props.icon || cardPreview;
  }

  private get tokenID() {
    return this.props.tokenID;
  }

  private get typeView() {
    return this.props.typeView || 'default';
  }

  private get isTransferAction() {
    return this.props.isTransferAction || false;
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

  public setDefaultImage = () => {
    if (this._refImage.current) {
      this._refImage.current.src = cardPreview;
    }
  };

  private getCardControls() {
    switch (this.typeView) {
      case 'default':
      case ProfileTokensType.favourites:
      case ProfileTokensType.activeBids:
      case ProfileTokensType.purchases:
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
              text={this.typeView === ProfileTokensType.purchases ? 'Sell' : this.props.buttonText}
              onClick={() => {
                this.onClick();
              }}
              color={buttonColors.goldFill}
              customClass={styles.buttonSecondControls}
              disabled={this.typeView === ProfileTokensType.purchases}
            />}
          </div>
        );
        break;
      case ProfileTokensType.onSale:
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
        break;
      case ProfileTokensType.createdItems:
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
        break;
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
        <div
          className={`${styles.card} ${this.isSmall ? styles.cardSmall : ''} ${this.props.customClass ? this.props.customClass : ''} ${this.props.isView ? styles.onlyViewed : ''}`}>
          <div className={styles.cardImage}>
            {this.props.linkTo ? (
              <NavLink to={this.props.linkTo}>
                <img className={styles.imageStyle} src={this.icon}
                     onError={this.setDefaultImage} ref={this._refImage}
                     alt={this.props.alt || 'preview image'} />
              </NavLink>
            ) : (
              <img onError={this.setDefaultImage} ref={this._refImage} className={styles.imageStyle} src={this.icon}
                   alt={this.props.alt || 'preview image'} />
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

            {this.isTransferAction && (
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

        {this.isTransferAction && (
          <>
            <ModalTransferNFT
              inShowModal={this.state.modalTransferIsShow}
              onHideModal={() => this.hideModal()}
              onSubmit={() => {
              }}
              tokenInfo={{}}
            />

            {/*<ModalSaleToken*/}
            {/*  inShowModal={false}*/}
            {/*  onHideModal={() => {}}*/}
            {/*  onSubmit={() => {*/}
            {/*  }}*/}
            {/*  tokenInfo={{}}*/}
            {/*/>*/}
          </>
        )}
      </>
    );
  }
}

export default withComponent(TokenCardView);
export type { ITokenCardView };
