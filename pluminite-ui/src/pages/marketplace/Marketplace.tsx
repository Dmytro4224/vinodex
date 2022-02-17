import React, { Component } from "react";

import searchIcon from '../../assets/icons/search.svg';
import { InputView } from "../../components/common/inputView/InputView";
import { ArtistCard } from "../../components/artistCard/ArtistCard";
import {ModalSample} from "../../components/common/modalSample/ModalSample";
import {buttonColors, ButtonView} from "../../components/common/button/ButtonView";

class Marketplace extends Component {
  state = {
    modalIsShow: false
  }

  private showModal() {
    this.setState({ modalIsShow: true })
  }

  private hideModal() {
    this.setState({ modalIsShow: false })
  }

  render() {
    return (
      <>
        <ButtonView
          text={'Show modal'}
          onClick={() => { this.showModal(); }}
          color={buttonColors.blue}
        />

        <ModalSample
          modalTitle={"Modal Title"}
          isShow={this.state.modalIsShow}
          onHide={() => { this.hideModal(); }}
          buttons={
            <>
              <ButtonView
                text={'Close'}
                onClick={() => { this.hideModal(); }}
                color={buttonColors.blue}
              />

              <ButtonView
                text={'Save'}
                onClick={() => {  }}
                color={buttonColors.blue}
              />
            </>
          }
        >

        </ModalSample>

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