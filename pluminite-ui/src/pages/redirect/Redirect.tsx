import { Component } from 'react';
import { Navigate } from 'react-router-dom';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';

interface IRedirectPageProps extends IProps {

}

interface IRedirectPageState {
  returnUrl?: string;
}

class RedirectPage extends Component<IRedirectPageProps & IBaseComponentProps, IRedirectPageState> {
  
  constructor(props: IRedirectPageProps & IBaseComponentProps) {
    super(props);

    this.state = {
      returnUrl: void 0
    }
  }

  public componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    let returnUrl = params.get('returnUrl') || '/';
    if (returnUrl.indexOf('/userProfile/') !== -1) {
      returnUrl = this.props.near.isAuth && this.props.near.user !== null ? returnUrl.replace('/userProfile/', `/userProfile/${this.props.near.user.accountId}`) : '/'
    }
    if (returnUrl.indexOf('redirect') !== -1) {
      returnUrl = '/';
    }
    this.setState({
      ...this.state,
      returnUrl: window.decodeURIComponent(returnUrl)
    });
  }

  public render() {
    if (this.state.returnUrl !== void 0) {
      return <Navigate to={this.state.returnUrl} />
    }
    return (
      <></>
    );
  }
}

export default withComponent(RedirectPage);
