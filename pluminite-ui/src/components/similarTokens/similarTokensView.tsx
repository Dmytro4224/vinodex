import { Component } from 'react';
import Skeleton from 'react-loading-skeleton';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import { mediaUrl } from '../../utils/sys';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import ButtonView, { buttonColors } from '../common/button/ButtonView';
import { EmptyListView } from '../common/emptyList/emptyListView';
import LabelView from '../common/label/labelView';
import TokenCardView from '../tokenCard/tokenCardView';
import styles from './similarTokens.module.css';

interface ISimilarTokensView extends IProps {
  list?: Array<ITokenResponseItem>;
}

class SimilarTokensView extends Component<ISimilarTokensView & IBaseComponentProps> {
  public state = { list: new Array<ITokenResponseItem>(), isLoading: true };

  constructor(props: ISimilarTokensView & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.props.nftContractContext.nft_tokens_by_filter(null, 1, 4, 7).then(response => {
      this.setState({ ...this.state, list: response, isLoading: false });
    });
  }

  render() {
    if (this.state.isLoading) {
      return <div className='d-flex align-items-center flex-gap-36'>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
        <div className='w-100'><Skeleton count={1} height={300} /><Skeleton count={3} /></div>
      </div>;
    }

    if (!this.state.list.length) {
      return (
        <>
          <LabelView text={'All'} />
          <EmptyListView />
        </>
      );
    }

    return <div>
      <div className='d-flex align-items-center justify-content-between mt-3 flex-wrap'>
        <LabelView text={'SIMILAR ITEMS'} />
        <ButtonView
          text={'Show all'}
          onClick={() => {
            this.props.navigate('/tokens/3');
          }}
          color={buttonColors.gold}
        />
      </div>
      <div className={`d-flex  flex-gap-36 mt-2 ${styles.scrollWrap}`}>
        {this.state.list.map(item => {
          return <TokenCardView
            key={`similartoken-${item.token_id}`}
            model={item}
            countL={1}
            countR={1}
            days={item.metadata.expires_at}
            name={item.metadata.title}
            author={item.owner_id}
            likesCount={item.metadata.likes_count}
            icon={mediaUrl(item.metadata)}
            isSmall={true}
            buttonText={`Place a bid`}
            linkTo={`/token/${item.token_id}`}
            tokenID={item.token_id}
            isLike={item.is_like}
            onClick={() => {
            }} />;
        })}
      </div>
    </div>;
  }
}

export default withComponent(SimilarTokensView);
