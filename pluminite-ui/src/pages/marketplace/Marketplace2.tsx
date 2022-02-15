import { Component } from "react";
import { buttonColors, ButtonView } from "../../components/common/button/ButtonView";
import { InputView } from "../../components/common/inputView/InputView";
import {TabsView} from "../../components/common/tabs/TabsView";
import searchIcon from '../../assets/icons/search.svg';

class Marketplace2 extends Component {
    render() {
        return (
            <>
                <ButtonView
                    onClick={(e) => { console.log(e) }}
                    text={'save'}
                    color={buttonColors.blue}
                />
                <TabsView tabItems={[{ title: "tab1" }, { title: "tab2" }]} type={'1'} />
            </>
        )
    }
}

export default Marketplace2;