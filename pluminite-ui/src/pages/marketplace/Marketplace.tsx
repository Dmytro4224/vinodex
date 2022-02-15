import {Component} from "react";
import {buttonColors, ButtonView} from "../../components/common/button/ButtonView";
import { InputView } from "../../components/common/inputView/InputView";
import {TabsView} from "../../components/common/tabs/TabsView";

class Marketplace extends Component {
  render() {
    return (
      <>
        <InputView
          onChange={(e) => {
            console.log(e)
          }}
          placeholder={'Search'}/>
          <ButtonView
              onClick={ (e) => { console.log(e) }}
              text={'save'}
              color={buttonColors.blue}
          />
          <TabsView tabItems={[{ title: "tab1" }, { title: "tab2" }]} type={'1'} />
      </>
    )
  }
}

export default Marketplace;