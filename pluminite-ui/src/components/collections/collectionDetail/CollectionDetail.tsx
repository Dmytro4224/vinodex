import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './collectionDetail.module.css';
import { Tab, Tabs } from 'react-bootstrap';
import CreateCollection from '../createCollection/CreateCollection';
import { RenderType } from '../Collections';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { ICollectionResponseItem } from '../../../types/ICollectionResponseItem';
import ModalCollectionToken from '../../modals/modalCollectionToken/ModalCollectionToken';
import TokenCardView from '../../tokenCard/tokenCardView';
import { mediaUrl } from '../../../utils/sys';
import ModalConfirm from '../../modals/modalConfirm/ModalConfirm';

interface ICollectionDetail extends IProps {
  changeRenderType?: (type: RenderType) => void;
  collectionData: ICollectionResponseItem | null;
}

class CollectionDetail extends Component<ICollectionDetail & IBaseComponentProps> {
  public state = {
    isBtnLoading: false,
    isShowModalTokens: false,
    isShowConfirmModal: false,
    modalConfirmData: {
      text: '',
      confirmCallback: () => {},
    },
  }

  constructor(props: ICollectionDetail & IBaseComponentProps) {
    super(props);
  }

  private changeRenderType(type: RenderType) {
    this.props.changeRenderType && this.props.changeRenderType(type);
  }

  private isTokenAdded(id) {
    return this.props.collectionData?.tokens?.find(token => token.token_id === id);
  }

  private removeTokenFromCollection(token_id) {
    this.setState({ ...this.state, isBtnLoading: true });

    this.modalToggleVisibility({
      isShowConfirmModal: true,
      modalConfirmData: {
        text: 'Are you sure you want to remove this NFT from collection?',
        confirmCallback: () => {
          this.props.nftContractContext.collection_token_remove(token_id).then(res => {
            this.modalToggleVisibility({ isShowConfirmModal: false });
            this.setState({ ...this.state, isBtnLoading: false });
          })
        },
      },
    });
  }

  private modalToggleVisibility(data: object) {
    this.setState({
      ...this.state,
      ...data,
    });
  }

  private addTokenFromCollection(token_id) {
    this.setState({ ...this.state, isBtnLoading: true });

    this.props.nftContractContext.collection_token_add(
      this.props.collectionData?.collection_id!,
      token_id
    ).then(res => {
      this.setState({ ...this.state, isBtnLoading: false });
    })
  }

  public render() {
    return (
      <div>
        <div className={styles.collectionTabWrap}>
          <Tabs
            id='controlled-tab-collections'
            className='justify-content-center'
          >
            <Tab eventKey='collectionDetails' title='COLLECTIONS DETAILS'>
              <CreateCollection
                changeRenderType={(type: RenderType) => this.changeRenderType(type)}
                collectionData={this.props.collectionData}
              />
            </Tab>
            <Tab eventKey='tokensCollection' title='TOKENS IN THE COLLECTION'>
              {this.props.collectionData?.tokens?.length ? (
                <div className={`gap-15 pb-4 ${styles.tokenWrap}`}>
                  <div className={styles.cardCreate}>
                    <h4>ADD A TOKEN TO THE COLLECTION</h4>
                    <p>Select a token from the existing ones and add it to this collection</p>
                    <ButtonView
                      text={`SELECT TOKEN`}
                      onClick={() => { this.setState({ ...this.state, isShowModalTokens: true }) }}
                      color={buttonColors.goldFill}
                      customClass={`min-w-100px ${styles.buttonSecondControls}`}
                    />
                  </div>
                  {this.props.collectionData.tokens.map(item => {
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
                              isLoading={this.state.isBtnLoading}
                            />
                          ) : (
                            <ButtonView
                              text={`Add to collection`}
                              onClick={() => { this.addTokenFromCollection(item.token_id) }}
                              color={buttonColors.goldFill}
                              customClass={`min-w-100px ${styles.buttonSecondControls}`}
                              isLoading={this.state.isBtnLoading}
                            />
                          )
                        }
                      />
                    );
                  })}
                </div>
              ) : (
                <div className={'ta-c my-5'}>
                  <h4 className={'mb-3'}>ADD A TOKEN TO THE COLLECTION</h4>
                  <p className={'mb-5 text-doveGrayS'}>Select a token from the existing  ones and add it to this collection</p>
                  <ButtonView
                    text={'SELECT TOKEN'}
                    customClass={'min-w-150px'}
                    onClick={() => { this.setState({ ...this.state, isShowModalTokens: true }) }}
                    color={buttonColors.goldFill}
                  />
                </div>
              )}
            </Tab>
          </Tabs>
        </div>

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

        <ModalCollectionToken
          onHideModal={() => { this.setState({ ...this.state, isShowModalTokens: false }) }}
          inShowModal={this.state.isShowModalTokens}
          collectionData={this.props.collectionData}
        />
      </div>
    );
  }
}


export default withComponent(CollectionDetail)
