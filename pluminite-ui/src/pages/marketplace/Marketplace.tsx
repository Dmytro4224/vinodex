import { Component } from "react";
import { InputView } from "../../components/common/inputView/InputView";
import searchIcon from '../../assets/icons/search.svg';

class Marketplace extends Component {
  render() {
    return (
      <div style={{ maxWidth: '300px' }}>
        <InputView
          onChange={(e) => { console.log(e) }}
          placeholder={'Search'}
          icon={searchIcon}
          absPlaceholder={'Search'}
        />
      </div>
    )
  }
}

export default Marketplace;