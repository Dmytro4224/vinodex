import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react"
import { NftContractContext } from '../../contexts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Navigate, Route, Routes } from 'react-router-dom';
import OrderDetail from '../../pages/orderDetail/orderDetail';
import Header from "../header/Header";
import UserProfile from '../../pages/userProfile/UserProfile';

class App extends Component {
  //static contextType = null;
  render() {
    return (
      <>
        <Header />

        <main>
          <Routes>
            <Route path="*" element={<Navigate to="/" />} />
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<p>ARTISTS PAGE</p>} />
            <Route path="/userProfile/:userId" element={<UserProfile />} />
            <Route path="/token/:tokenId" element={<OrderDetail />} />
          </Routes>
        </main>

        {/*<NftContractContext.Consumer>
            {context => (
                <span>{context?.nftContract?.contractId}</span>
            )}
        </NftContractContext.Consumer>*/}
      </>
    );
  }
}

export { App }
