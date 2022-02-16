import { Component } from "react";

import searchIcon from '../../assets/icons/search.svg';
import { InputView } from "../../components/common/inputView/InputView";
import { ArtistCard } from "../../components/artistCard/ArtistCard";

class Marketplace extends Component {
  render() {
    return (
      <>
        <ArtistCard
          name={'Artist Name'}
          identification={'0x0b9D2weq28asdqwe132'}
          usersCount={22}
          likesCount={12}
          isFollow={false}
        />

        <div style={{ maxWidth: '300px' }}>
          <InputView
            onChange={(e) => { console.log(e) }}
            placeholder={'Search'}
            icon={searchIcon}
            absPlaceholder={'Search'}
          />
        </div>
      </>
    )
  }
}

export default Marketplace;