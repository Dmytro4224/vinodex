import { Component } from "react"
import Marketplace from "../../pages/marketplace/Marketplace";
import styles from '../../pages/marketplace/marketplace.module.css';

// import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <>
        <p className={styles.title}>qweqwe</p>
        <Marketplace />
      </>
    );
  }
}

export default App;
