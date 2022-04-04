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
import Footer from '../footer/Footer';
import CatalogTokens from '../../pages/catalogTokens/CatalogTokens';
import CollectionsPage from '../../pages/collections/Collections';
import CollectionDetailPage from '../../pages/collectionDetail/CollectionDetailPage';
import ArtistDetail from '../../pages/artistDetail/ArtistDetail';
import NotFound from '../../pages/NotFound/NotFound';
import RedirectPage from '../../pages/redirect/Redirect';

interface IApp extends IProps {

}

class App extends Component<IApp & IBaseComponentProps> {
  private updateUserInfo: (() => void) | undefined = undefined;

  public componentDidMount() {
     // this.props.nftContractContext.minting_accounts_add('dxd.testnet')

    this.props.nftContractContext.nft_tokens_catalogs().then(response => {
      const catalogs = ['All'];
      catalogs.push(...response);

      this.props.near.setCatalogs(catalogs);
    });
  }

  private setToUpdateUser(updateMtd: () => void) {
    this.updateUserInfo = updateMtd;
  }

  public callUpdateUserInfo = async () => {
    this.updateUserInfo && this.updateUserInfo();
  }

  public render() {
    return (
      <>
        <Header setToUpdateUser={(updateMtd: () => void) => { this.setToUpdateUser(updateMtd) }} />

        <main>
          <Routes>
            {/*<Route path="*" element={<Navigate to="/" />} />*/}
            <Route path="*" element={<NotFound />} />
            <Route path="/" element={<Home />} />
            <Route path="/artists/" element={<ArtistsView parameter={BestArtistsParameter.likes_count} />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/collections/" element={<CollectionsPage />} />
            <Route path="/collections/:id" element={<CollectionDetailPage />} />
            <Route path="/userProfile/:userId" element={<UserProfile callUpdateUserInfo={this.callUpdateUserInfo} />} />
            <Route path="/token/:tokenId" element={<OrderDetail />} />
            <Route path="/tokens/:type" element={<CatalogTokens />} />
            <Route path="/create/:type" element={<CreateToken />} />
            <Route path="/redirect" element={<RedirectPage />} />
          </Routes>
        </main>

        <Footer />

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
      </>
    );
  }
}

export default withComponent(App);
