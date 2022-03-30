import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import styles from './navigation.module.css';
import arrowDown from '../../assets/icons/arrow-down-black.svg';

const navigationData = [
  {
    name: 'Home',
    linkClass: `${styles.navLink}`,
    path: '/',
    id: 1,
    isIcon: false,
    submenuData: null,
  },
  {
    name: 'Collections',
    linkClass: `${styles.navLink}`,
    path: '/collections',
    id: 2,
    isIcon: false,
    submenuData: null,
  },
  {
    name: 'Artists',
    linkClass: `${styles.navLink}`,
    path: '/artists',
    id: 3,
    isIcon: false,
    submenuData: null,
  },
];

class HeaderNavigation extends Component {
  private getLink({ name, linkClass, path, id, isIcon, submenuData }) {
    const setActive = ({ isActive }) => (isActive ? `${linkClass} ${styles.active}` : linkClass);

    return (
      <li key={id} className={styles.navItem}>
        <NavLink className={setActive} to={path}><p className="d-flex align-items-center">{name}{isIcon && <img src={arrowDown} alt='arrow' />}</p></NavLink>
      </li>
    );
  }

  render() {
    return (
      <nav>
        <ul className="d-flex align-items-center">
          {navigationData.map(this.getLink)}
        </ul>
      </nav>
    );
  }
}

export { HeaderNavigation };
