import React, {Component} from "react";
import {LabelView} from "../common/label/labelView";
import {buttonColors, ButtonView} from "../common/button/ButtonView";
import ArtistCard from "../artistCard/ArtistCard";

class BestArtists extends Component {
  render() {
    const artists = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}];

    return (
      <>
        <div className="d-flex align-items-center justify-content-between mt-3">
          <LabelView  text={'Best Artists'}/>
          <ButtonView
            text={'More'}
            onClick={() => {  }}
            color={buttonColors.gold}
          />
        </div>

        <div className="d-flex flex-wrap flex-gap-36 mt-3 justify-content-between">
          {artists.map(item => {
            return <ArtistCard
              key={item.id}
              name={'Artist Name'}
              identification={'0x0b9D2weq28asdqwe132'}
              usersCount={22}
              likesCount={12}
              isFollow={false}
            />;
          })}
        </div>
      </>
    );
  }
}

export { BestArtists };