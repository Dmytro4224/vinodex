import styles from './tabsView.module.css';
import React, { Component, MouseEvent, useState } from "react";
import { buttonColors } from "../button/ButtonView";
import { classList } from "../../../utils/sys";
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';

enum tabType {
  button = 'button',
  link = 'link',
}

interface ITabsView extends IProps {
  tabItems: ITabsViewItem[];
  type: tabType;
  currentTabIndex: number;
  onClick: (item: ITabsViewItem) => void;
}

export interface ITabsViewItem {
  title: string;
  link: string;
  id: number;
}

class TabsView extends Component<ITabsView & IBaseComponentProps>{
  private readonly _refs: React.RefObject<HTMLLIElement>[];
  private _currentTab: ITabsViewItem | null;
  private readonly _currentTabIndex: number;

  constructor(props: ITabsView & IBaseComponentProps) {
    super(props);

    this._refs = this.props.tabItems.map(tab => React.createRef());
    this._currentTabIndex = this.props.currentTabIndex === undefined ? -1 : this.props.currentTabIndex;

    this._currentTab = this._currentTabIndex === -1 ? null : this.props.tabItems[this._currentTabIndex];
  }

  private get tabs() {
    return this.props.tabItems;
  }

  private get type() {
    return this.props.type;
  }

  private get currentTabIndex() {
    return this.props.currentTabIndex;
  }

  private onTabClick = async (item: ITabsViewItem) => {
    // if (this._currentTab !== null) {
    //   this._refs[this.tabs.findIndex(tab => tab.id === this._currentTab?.id)].current?.classList.remove(styles.active);
    // }

    this._refs.forEach(ref => ref.current?.classList.remove(styles.active));

    this._refs[this.tabs.findIndex(tab => tab.id === item.id)].current?.classList.add(styles.active);
    this._currentTab = item;

    this.props.onClick(item);
  }

  render() {
    switch (this.type) {
      case 'link':
        return this.renderLinkType();
        break;
      case 'button':
        return this.renderButtonType();
        break;
      default:
        return this.renderButtonType();
        break;
    }
  }

  private renderButtonType() {
    const currTabIndex = this._currentTabIndex === -1 ? 0 : this._currentTabIndex;

    return (
      <ul className={classList(styles.tabsWrap, styles.buttonTabs)}>
        {this.tabs.map((item, i) => {
          return (
            <li key={i}>
              <span
                ref={this._refs[i]}
                onClick={() => { this.onTabClick(item) }}
                className={`${styles.tabItem} ${currTabIndex === i ? styles.active : ''}`}>
                {item.title}
              </span>
            </li>
          )
        })}
      </ul>
    )
  }

  private renderLinkType() {
    const currTabIndex = this._currentTabIndex === -1 ? 0 : this._currentTabIndex;

    return (
      <ul className={classList(styles.tabsWrap, styles.linkTabs)}>
        {this.tabs.map((item, i) => {
          return (
            <li key={i}>
              <span
                ref={this._refs[i]}
                onClick={() => { this.onTabClick(item) }}
                className={`${styles.tabItem} ${currTabIndex === i ? styles.active : ''}`}>
                {item.title}
              </span>
            </li>
          )
        })}
      </ul>
    )
  }
}
export default withComponent(TabsView);
export { tabType }