import { Component } from "react";
import { buttonColors, ButtonView } from "../../components/common/button/ButtonView";
import { InputView } from "../../components/common/inputView/InputView";
import {TabsView, tabType} from "../../components/common/tabs/TabsView";
import {DropdownView, dropdownColors} from "../../components/common/dropdown/dropdownView";
import arrow from '../../assets/icons/arrow-down.svg';

class Marketplace2 extends Component {
    render() {
        return (
            <>
                <DropdownView
                    colorType={dropdownColors.select}
                />
                <ButtonView
                    onClick={(e) => { console.log(e) }}
                    text={'Sort by'}
                    color={buttonColors.select}
                    icon={arrow}
                />

                <TabsView tabItems={
                    [
                        { title: "All", id: 1, link: "#" },
                        { title: "Art", id: 2, link: "#" },
                        { title: "Music", id: 3, link: "#" },
                        { title: "Domain Names", id: 4, link: "#" },
                        { title: "Virtual Worlds", id: 5, link: "#" },
                        { title: "Trading Cards", id: 6, link: "#" },
                        { title: "Collectibles", id: 7, link: "#" },
                        { title: "Sports", id: 8, link: "#" },
                        { title: "Utility", id: 9, link: "#" },
                    ]}    type={ tabType.button}
                          onClick={(item) => { console.log(item) }}
                          currentTabIndex={0}
                />
            </>
        )
    }
}

export default Marketplace2;