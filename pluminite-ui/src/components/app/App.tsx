import { Component } from "react"
import Marketplace from "../../pages/marketplace/Marketplace";
import {ButtonView} from "../common/button/Button";

// import styles from './App.module.css';

class App extends Component<any, any> {
  render() {
    return (
      <>
        <Marketplace />
        <ButtonView />
      </>
    );
  }
}

export default App;
