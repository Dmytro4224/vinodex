import { Component } from "react";
import { buttonColors, ButtonView } from "../../components/common/button/ButtonView";
import { InputView } from "../../components/common/inputView/InputView";
import {TabsView} from "../../components/common/tabs/TabsView";
import searchIcon from '../../assets/icons/search.svg';

class Marketplace extends Component {
  render() {
    return (
      <>
        <InputView
          onChange={(e) => { console.log(e) }}
          placeholder={'Search'}
          icon={searchIcon}
          absPlaceholder={'Search'}
        />
      </>
    )
  }
}

export default Marketplace;