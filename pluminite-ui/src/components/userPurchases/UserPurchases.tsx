import { Component } from "react";
import MediaQuery from "react-responsive";
import { mediaUrl } from "../../utils/sys";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import { EmptyListView } from "../common/emptyList/emptyListView";
import TabsFilterView from "../tabsFilterView/tabsFilterView";
import TokenCardView from "../tokenCard/tokenCardView";
import styles from './userPurchases.module.css';

interface IUserPurchases extends IProps {
}

class UserProfile extends Component<IUserPurchases & IBaseComponentProps> {
  public state = {
    list: new Array<any>(),
    currentCatalog: -1,
    catalog: this.props.near.catalogs[0],
    isLoading: true,
  };

  constructor(props: IUserPurchases & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.loadData();
  }

  public componentDidUpdate(prevProps, prevState) {
    if (prevState.catalog !== this.catalog) {
      this.loadData();
    }
  }

  private get catalog() {
    return this.props.near.catalogs[this.state.currentCatalog];
  }

  private loadData() {
    this.props.nftContractContext.my_purchases(this.catalog, 1, 1000, this.props.params.userId!).then(response => {
      this.setState({
        ...this.state,
        list: response,
        isLoading: false,
        catalog: this.catalog,
      });
    }).catch(ex => {
      console.error('loadData ex => ', ex);
    });
  }

  private setCatalog(catalog: number) {
    this.setState({ ...this.state, currentCatalog: catalog });
  }

  render() {
    return (
      <div className={`container`}>
        <MediaQuery minWidth={992}>
          <div className={`d-flex align-items-center justify-content-between my-4 ${styles.filterWrap}`}>
            <div />

            <TabsFilterView
              currentTabIndex={this.state.currentCatalog}
              onClick={(index) => {
                this.setCatalog(index);
              }}
            />

            <div />
          </div>
        </MediaQuery>
        <MediaQuery maxWidth={991}>
          <div className='d-flex flex-column w-100'>
            <div className={`d-flex align-items-center mt-4 ${styles.filterWrap}`}>
              <TabsFilterView
                currentTabIndex={this.state.currentCatalog}
                onClick={(index) => {
                  this.setCatalog(index);
                }}
              />
            </div>
          </div>
        </MediaQuery>

        <p className='line-separator my-4' />

        {!this.state.list.length ? (
          <EmptyListView />
        ) : (
          <div className={`d-flex flex-gap-36 pb-4`}>
            {this.state.list.map(item => {
              const { token } = item;

              return (
                <TokenCardView
                  key={`profiletoken-purchases-${token.token_id}`}
                  model={token}
                  countL={1}
                  countR={1}
                  days={token.metadata.expires_at}
                  name={token.metadata.title}
                  author={token.owner_id}
                  likesCount={token.metadata.likes_count}
                  icon={mediaUrl(token.metadata)}
                  isSmall={true}
                  buttonText={`Place a bid`}
                  linkTo={`/token/${token.token_id}`}
                  tokenID={token.token_id}
                  isLike={token.is_like}
                  price={token.metadata.price}
                  isForceVisible={true}
                  onClick={() => {
                  }}
                />
              );
            })}
          </div>
        )}
      </div>
    )
  }
}

export default withComponent(UserProfile);
