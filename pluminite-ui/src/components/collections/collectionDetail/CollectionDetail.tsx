import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './collectionDetail.module.css';
import { Tab, Tabs } from 'react-bootstrap';
import CreateCollection from '../createCollection/CreateCollection';
import { RenderType } from '../Collections';

interface ICollectionDetail extends IProps {
  changeRenderType?: (type: RenderType) => void;
}

class CollectionDetail extends Component<ICollectionDetail & IBaseComponentProps> {
  constructor(props: ICollectionDetail & IBaseComponentProps) {
    super(props);
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
              <CreateCollection />
            </Tab>
            <Tab eventKey='tokensCollection' title='TOKENS IN THE COLLECTION'>
              TOKENS IN THE COLLECTION
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}


export default withComponent(CollectionDetail)
