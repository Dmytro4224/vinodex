import React, {Component} from "react";
import { CarouselView } from "../../components/carousel/carouselView";
import { buttonColors, ButtonView } from "../../components/common/button/ButtonView";
import {dropdownColors, DropdownView } from "../../components/common/dropdown/dropdownView";
import { TabsView, tabType } from "../../components/common/tabs/TabsView";
import { TokenCardView } from "../../components/tokenCard/tokenCardView";
import { NearContext } from "../../contexts";
import {LabelView} from "../../components/common/label/labelView";

class Home extends Component {
  render() {
    return (
      <div>
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

          <NearContext.Consumer>
            {context => (
              <>
                <TabsView tabItems={
                  [
                    { title: "All", id: 1, link: "#" },
                    { title: "Art", id: 2, link: "#" },
                    { title: "Music", id: 3, link: "#" },
                    { title: "Domain Names", id: 4, link: "#" },
                    { title: "Virtual Worlds", id: 5, link: "#" },
                    { title: "Trading Cards", id: 6, link: "#" },
                    { title: "Collectibles", id: 7, link: "#" },
                    { title: "Sports", id: 8, link: "#" },
                    { title: "Utility", id: 9, link: "#" },
                  ]} type={tabType.button}
                          onClick={(item) => {

                            context.setUser({ accountId: item.title, balance: item.id.toString() });

                          }}
                          currentTabIndex={0}
                />
                {/*
                            // @ts-ignore */}
                {/*<span>{context.user ? context.user.accountId : 'NONE'}</span>*/}
              </>
            )}
          </NearContext.Consumer>

          <ButtonView
            text={"Filter"}
            onClick={() => {  }}
            color={buttonColors.select}
          />
        </div>

        <p className="separator-horizontal" />
        
        <div className="d-flex align-items-center justify-content-between mt-3">
          <LabelView  text={'Top 10'}/>
          <ButtonView
            text={'More'}
            onClick={() => {  }}
            color={buttonColors.white}
          />
        </div>

        <CarouselView customCLass={'carousel-owl-tokens'}
                        childrens={[{id: 1}, {id: 2}, {id: 3}].map(item => {
                          return <TokenCardView key={item.id}
                                                countL={item.id}
                                                countR={10}
                                                days={'121 days left'}
                                                name={'Item Name'}
                                                author={'Creat name'}
                                                likesCount={99}
                                                isSmall={false}
                                                buttonText={'Place a bid 0.08 ETH'}
                                                onClick={() => {
                                                  alert('buy Place a bid 0.08 ETH');
                                                }}/>;
                        })}/>

        <p className="separator-horizontal" />

        <div className="d-flex align-items-center justify-content-between mt-3">
          <LabelView  text={'Popular'}/>
          <ButtonView
            text={'More'}
            onClick={() => {  }}
            color={buttonColors.white}
          />
        </div>

        <div className="d-flex flex-wrap flex-gap-36 mt-3">
          {[{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}].map(item => {
            return <TokenCardView key={item.id}
                                  countL={item.id}
                                  countR={10}
                                  days={'121 days left'}
                                  name={'Item Name'}
                                  author={'Creat name'}
                                  likesCount={99}
                                  isSmall={true}
                                  buttonText={'Place a bid 0.08 ETH'}
                                  onClick={() => {
                                    alert('buy Place a bid 0.08 ETH');
                                  }}/>;
          })}
        </div>

        {/*<Marketplace />
        <Marketplace2 />*/}
      </div>
    );
  }
}

export { Home };