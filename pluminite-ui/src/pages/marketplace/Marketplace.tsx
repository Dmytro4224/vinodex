import { Component } from "react";
import { InputView } from "../../components/common/input/InputView";

class Marketplace extends Component {
  render() {
    return (
      <>
        <InputView
          onChange={(e) => {
            console.log(e)
          }}
          placeholder={'Search'}/>
      </>
    )
  }
}

export default Marketplace;