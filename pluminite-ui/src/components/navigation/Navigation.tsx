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

class Navigation extends Component {
  private getLink({ name, linkClass, path, id }) {
    const setActive = ({ isActive }) => (isActive ? `${linkClass} ${styles.active}` : linkClass);

    return <NavLink key={id} className={setActive} to={path}>{name}</NavLink>;
  }

  render() {
    return (
      <nav>
        <ul>
          {navigationData.map(this.getLink)}
        </ul>
      </nav>
    );
  }
}

export { Navigation };