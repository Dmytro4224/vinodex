import { Component } from "react"
import Marketplace from "../../pages/marketplace/Marketplace";
import Marketplace2 from "../../pages/marketplace/Marketplace2";
import 'bootstrap/dist/css/bootstrap.min.css';

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
