import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import image from '../../assets/images/notfound-logo.png';
import styles from './NotFound.module.css';

interface INotFound extends IProps {

}

interface INotFoundState {

}

class NotFound extends Component<INotFound & IBaseComponentProps, INotFoundState> {
  constructor(props: INotFound & IBaseComponentProps) {
    super(props);
  }

  public render() {
    return (
      <div className={'d-flex flex-wrap flex-column flex-gap-36 mt-3 mb-5 container'}>
        <div className={`d-flex justify-content-center align-items-baseline ${styles.notFoundHead}`}>
          <div className={styles.notFoundHeadLeft}>ERROR</div>
          <div className={styles.notFoundHeadCenter}>404</div>
          <div className={styles.notFoundHeadRight}>PAGE NOT FOUND</div>
        </div>
        <div className={styles.notFoundImage}>
          <img src={image} className={styles.notFoundImageImg} />
        </div>
        <div className={styles.notFoundBottom}>
          We are sorry but the page you are looking for does not exist.<br />
          You could return to <NavLink className={styles.notFoundBottomLink} to={'/'}>Home page</NavLink>
        </div>
      </div>
    );
  }
}

export default withComponent(NotFound);
