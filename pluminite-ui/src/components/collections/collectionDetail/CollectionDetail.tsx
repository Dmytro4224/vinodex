import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './collectionDetail.module.css';
import { Tab, Tabs } from 'react-bootstrap';
import CreateCollection from '../createCollection/CreateCollection';
import { RenderType } from '../Collections';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { ICollectionResponseItem } from '../../../types/ICollectionResponseItem';
import ModalCollectionToken from '../../modals/modalCollectionToken/ModalCollectionToken';

interface ICollectionDetail extends IProps {
  changeRenderType?: (type: RenderType) => void;
  collectionData: ICollectionResponseItem | null;
}

class CollectionDetail extends Component<ICollectionDetail & IBaseComponentProps> {
  public state = {
    isShowModalTokens: false
  }

  constructor(props: ICollectionDetail & IBaseComponentProps) {
    super(props);
  }

  private changeRenderType(type: RenderType) {
    this.props.changeRenderType && this.props.changeRenderType(type);
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
            </Tab>
          </Tabs>
        </div>

        <ModalCollectionToken
          onHideModal={() => { this.setState({ ...this.state, isShowModalTokens: false }) }}
          inShowModal={this.state.isShowModalTokens}
        />
      </div>
    );
  }
}


export default withComponent(CollectionDetail)
