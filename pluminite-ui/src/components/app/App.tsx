import 'bootstrap/dist/css/bootstrap.min.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Component } from "react"
import Marketplace from "../../pages/marketplace/Marketplace";
import Marketplace2 from "../../pages/marketplace/Marketplace2";

class App extends Component {
  render() {
    return (
      <>
        <Marketplace />
        <Marketplace2/>
      </>
    );
  }
}

export default App;
