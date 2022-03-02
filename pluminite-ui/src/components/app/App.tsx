import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react"
import { NftContractContext } from '../../contexts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'react-loading-skeleton/dist/skeleton.css'
import { Navigate, Route, Routes } from 'react-router-dom';
import Home from "../../pages/home/Home";
import Header from "../header/Header";
import UserProfile from '../../pages/userProfile/UserProfile';
import OrderDetail from '../../pages/orderDetail/orderDetail';
import CreateToken from '../../pages/createToken/createToken';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import { ToastContainer } from 'react-toastify';
import ArtistsView from '../../pages/artists';
import { BestArtistsParameter } from '../../types/BestArtistsParameter';

interface IApp extends IProps {

}

class App extends Component<IApp & IBaseComponentProps> {
  private updateUserInfo: (() => void) | undefined = undefined;

  public componentDidMount() {
    this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      this.props.near.setCatalogs(response);
    });
  }

  private setToUpdateUser(updateMtd: () => void) {
    this.updateUserInfo = updateMtd;
  }

  public callUpdateUserInfo() {
    this.updateUserInfo && this.updateUserInfo();
  }

  public render() {
    return (
      <>
        <Header setToUpdateUser={(updateMtd: () => void) => { this.setToUpdateUser(updateMtd) }} />

        <main>
          <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Home />} />
            <Route path="/artists/" element={<ArtistsView parameter={BestArtistsParameter.likes_count} />} />
            <Route path="/userProfile/:userId" element={<UserProfile callUpdateUserInfo={() => this.callUpdateUserInfo()} />} />
            <Route path="/token/:tokenId" element={<OrderDetail />} />
            <Route path="/create/" element={<CreateToken />} />
          </Routes>
        </main>

        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        {/*<NftContractContext.Consumer>
            {context => (
                <span>{context?.nftContract?.contractId}</span>
            )}
        </NftContractContext.Consumer>*/}
      </>
    );
  }
}

export default withComponent(App);
