import React, {Component} from "react";
import { CarouselView } from "../../components/carousel/carouselView";
import { buttonColors, ButtonView } from "../../components/common/button/ButtonView";
import {dropdownColors, DropdownView } from "../../components/common/dropdown/dropdownView";
import { TabsView, tabType } from "../../components/common/tabs/TabsView";
import {TokenCardView } from "../../components/tokenCard/tokenCardView";
import { NearContext } from "../../contexts";
import {LabelView} from "../../components/common/label/labelView";
import ArtistCard from "../../components/artistCard/ArtistCard";
import { withComponent } from '../../utils/withComponent';
import {BestArtists} from "../../components/bestArtists/BestArtists";
import { Params } from 'react-router-dom';
import { INftContractContext } from '../../contexts/nftContract';
import TopTokensView from "../../components/topTokens/topTokensView";
import PopularTokensView from "../../components/popularTokens/popularTokensView";
import TabsFilterView from "../../components/tabsFilterView/tabsFilterView";

interface IHome {
    params: Params<string>;
    nftContractContext: INftContractContext

}
class Home extends Component<IHome> {
  render() {
    return (
      <div className="my-5 container">
        <div className="d-flex align-items-center justify-content-between">
          <DropdownView
            colorType={dropdownColors.select}
            title={'Sort by'}
            onChange={(item) => { console.log(item) }}
            childrens={[
              {
                id: 1,
                title: 'Recently Listed'
              },
              {
                id: 2,
                title: 'Recently Created'
              },
              {
                id: 3,
                title: 'Recently Sold'
              }
            ]}
          />

          <TabsFilterView catalogs={null} />

          <ButtonView
            text={"Filter"}
            onClick={() => {  }}
            color={buttonColors.select}
          />
        </div>

        <p className="separator-horizontal" />

        <TopTokensView list={[]} />

        <p className="separator-horizontal" />

        <PopularTokensView />

        <p className="separator-horizontal" />

        <BestArtists />

        <p className="separator-horizontal" />

        <AllTokensView />

        <div className="d-flex align-items-center justify-content-center mt-5 w-100">
          <ButtonView
                    text={'Load more'}
                    onClick={() => {
                        //@ts-ignore
                        console.log(this.props.params);
                         //@ts-ignore
                        this.props.navigate('/userProfile/q874587321JSAHFJHA');
                    }}
            color={buttonColors.select}
          />
            </div>



      </div>
    );
  }
}

export default withComponent(Home);

