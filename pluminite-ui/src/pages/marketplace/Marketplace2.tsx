import { Component } from "react";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import InputView  from "../../components/common/inputView/InputView";
import TabsView, {tabType} from "../../components/common/tabs/TabsView";
import {DropdownView, dropdownColors} from "../../components/common/dropdown/dropdownView";
import arrow from '../../assets/icons/arrow-down.svg';
import TokenCardView  from "../../components/tokenCard/tokenCardView";
import CarouselView  from "../../components/carousel/carouselView";
import { NearContext } from '../../contexts';

class Marketplace2 extends Component {
    render() {
        return (
            <>
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

                                    //context.instance!.setUser({ accountId: item.title, balance: item.id.toString() });

                                }}
                                currentTabIndex={0}
                            />
                            
                        </>
                    )}
                </NearContext.Consumer>
                {/*<TokenCardView
                    countL={3}
                    countR={10}
                    days={'121 days left'}
                    name={'Item Name'}
                    author={'Creat name'}
                    likesCount={99}
                    isSmall={false}
                    buttonText={'Place a bid 0.08 ETH'}
                    onClick={() => { alert('buy Place a bid 0.08 ETH') }} />*/}

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
            </>
        )
    }
}

export default Marketplace2;