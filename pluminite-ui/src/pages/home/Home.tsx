import React, {Component} from "react";
import Marketplace from "../marketplace/Marketplace";
import Marketplace2 from "../marketplace/Marketplace2";

class Home extends Component {
  render() {
    return (
      <div>
        <p>MARKETPLACE PAGE</p>

        <Marketplace />
        <Marketplace2 />
      </div>
    );
  }
}

export { Home };