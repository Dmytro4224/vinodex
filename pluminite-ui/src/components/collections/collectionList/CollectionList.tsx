import { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import CollectionCard from '../collectionCard/CollectionCard';
import styles from './collectionList.module.css';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { RenderType } from '../Collections';

interface ICollectionList extends IProps {
  changeRenderType?: (type: RenderType) => void;
}

class CollectionList extends Component<ICollectionList & IBaseComponentProps> {
  constructor(props: ICollectionList & IBaseComponentProps) {
    super(props);
  }

  public render() {
    return (
      // if list empty
      //
      // <div className='w-100 my-5 d-flex align-items-center justify-content-center flex-column'>
      //     <p className={styles.titleCreate}>Create a new collection of tokens</p>
      //
      //     <ButtonView
      //       text={'CREATE COLLECTION'}
      //       onClick={() => {  }}
      //       color={buttonColors.goldFill}
      //       customClass={`ml-10px min-w-100px`}
      //     />
      // </div>
      //
      // else
      <div className={styles.listWrap}>
        <div className={styles.createCollectionCard}>
          <p className={styles.titleCreate}>Create a new collection of tokens</p>

          <ButtonView
            text={'CREATE COLLECTION'}
            onClick={() => {  }}
            color={buttonColors.goldFill}
            customClass={`ml-10px min-w-100px`}
          />
        </div>

        <CollectionCard />
      </div>
    )
  }
}

export default withComponent(CollectionList)
