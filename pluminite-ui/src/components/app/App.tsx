import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react"
import { NftContractContext } from '../../contexts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {Link, Navigate, Route, Routes} from 'react-router-dom';
import Home from "../../pages/home/Home";
import {Header} from "../header/Header";
import { UserProfile } from '../../pages/userProfile/UserProfile';

class App extends Component {
    //static contextType = null;
  render() {
    return (
      <>
        <Header />

        <main className="container">
          <Routes>
            <Route path="*" element={ <Navigate to="/" /> } />
            <Route path="/" element={ <Home /> } />
            <Route path="/artists/*" element={ <p>ARTISTS PAGE</p> } />
            <Route path="/userProfile/:userId" element={ <UserProfile /> } />
            <Route path="/token/:id" element={ <p>TOKEN PAGE</p> } />
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
