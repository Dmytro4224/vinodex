import { Component } from "react";
import styles from './infoCounters.module.css';

interface IInfoCounters { }

class InfoCounters extends Component<IInfoCounters> {
  render() {
    return (
      <div className={styles.counterWrap}>
        <div className={styles.itemWrap}>
          <p className={styles.itemCount}>0</p>
          <p className={styles.itemDesc}>Item</p>
        </div>
        <div className={styles.itemWrap}>
          <p className={styles.itemCount}>0</p>
          <p className={styles.itemDesc}>Followers</p>
        </div>
        <div className={styles.itemWrap}>
          <p className={styles.itemCount}>0</p>
          <p className={styles.itemDesc}>Likes</p>
        </div>
      </div>
    )
  }
}

export { InfoCounters };