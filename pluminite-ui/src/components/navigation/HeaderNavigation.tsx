import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import styles from './navigation.module.css';

const navigationData = [
  {
    name: 'Marketplace',
    linkClass: `${styles.navLink}`,
    path: '/',
    id: 1
  },
  {
    name: 'Artists',
    linkClass: `${styles.navLink}`,
    path: '/artists',
    id: 2
  },
];

class HeaderNavigation extends Component {
  private getLink({ name, linkClass, path, id }) {
    const setActive = ({ isActive }) => (isActive ? `${linkClass} ${styles.active}` : linkClass);

    return <li key={id} className={styles.navItem}><NavLink className={setActive} to={path}>{name}</NavLink></li>;
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