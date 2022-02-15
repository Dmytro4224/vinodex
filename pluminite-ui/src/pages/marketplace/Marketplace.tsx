import {Component} from "react";
import {buttonColors, ButtonView} from "../../components/common/button/ButtonView";
import { InputView } from "../../components/common/inputView/InputView";

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
      </>
    )
  }
}

export default Marketplace;