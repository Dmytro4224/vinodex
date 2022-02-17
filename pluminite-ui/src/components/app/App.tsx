import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from "react"
import { NftContractContext } from '../../contexts';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Component } from "react"
import Marketplace from "../../pages/marketplace/Marketplace";
import Marketplace2 from "../../pages/marketplace/Marketplace2";

class App extends Component {
    //static contextType = null;
  render() {
    return (
      <>
        <Marketplace />
            <Marketplace2 />

            <NftContractContext.Consumer>
                {context => (
                    <span>{context?.nftContract?.contractId}</span>
                )}
            </NftContractContext.Consumer>
      </>
    );
  }
}

export { App }

