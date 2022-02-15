import styles from './tabsView.module.css';
import {Component, MouseEvent} from "react";
import {buttonColors} from "../button/ButtonView";

interface ITabsView{
    tabItems: ITabsViewItem[];
    type: string;
}

interface ITabsViewItem{
    title: string;
}

class TabsView extends Component<Readonly<ITabsView>>{
    constructor(props: ITabsView) {
        super(props);
    }

    private get tabs(){
        return this.props.tabItems;
    }

    render() {
        return (
            <div className={"tabs-wrap"}>
                {this.tabs.map(item => item.title)}
            </div>
        )
    }
}

export { TabsView }