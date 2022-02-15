import { Component } from "react";
import { buttonColors, ButtonView } from "../../components/common/button/ButtonView";
import { InputView } from "../../components/common/inputView/InputView";
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
        <ButtonView
          onClick={(e) => { console.log(e) }}
          text={'save'}
          color={buttonColors.blue}
        />
      </>
    )
  }
}

export default Marketplace;