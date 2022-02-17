import { Component, useRef } from 'react';
import styles from './carouselView.module.css';
import { TokenCardView } from '../tokenCard/tokenCardView';
import next from '../../assets/icons/arrow-slider-right.svg';
import prev from '../../assets/icons/arrow-slider-left.svg';
// @ts-ignore
import Slider from "react-slick";

interface ICarouselView{
  customCLass: string,
  tokenItems: ITokenItem[],
  onClick: (item: ITokenItem) => void
}

interface ITokenItem{
  id: number,
  icon?: any;
  alt?: string;
  countL: number;
  countR: number;
  days: string;
  name: string;
  author: string;
  likesCount: number;
  buttonText: string;
  isSmall?: boolean;
  onClick?: (item: ITokenItem) => void
}

class CarouselView extends Component<Readonly<ICarouselView>>{
  constructor(props: ICarouselView) {
    super(props);
  }

  private SampleNextArrow() {
    return (
      <img src={next} alt={''}/>
    );
  }

  private SamplePrevArrow() {
    return (
      <img src={prev} alt={''}/>
    );
  }

  private onClick = (item: ITokenItem) => {
    this.props.onClick(item);
  }

  render(){
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2,
      centerPadding: '130px',
      nextArrow: this.SampleNextArrow(),
      prevArrow: this.SamplePrevArrow()
    };

    return (
      <div className={`${styles.carouselWrap} ${this.props.customCLass || ''}`}>
        <Slider {...settings} className={styles.gap}>
          {this.props.tokenItems.map(item => {
            return <TokenCardView key={item.id}
              countL={item.countL}
              countR={item.countR}
              days={item.days}
              name={item.name}
              author={item.author}
              likesCount={item.likesCount}
              isSmall={false}
              buttonText={item.buttonText}
              onClick={() => { this.onClick(item) }} />
          })}

          <TokenCardView
            countL={3}
            countR={10}
            days={'121 days left'}
            name={'Item Name'}
            author={'Creat name'}
            likesCount={99}
            isSmall={false}
            buttonText={'Place a bid 0.08 ETH'}
            onClick={() => { alert('buy Place a bid 0.08 ETH') }} />
        </Slider>
        {/*<Carousel className={styles.carousel} variant="dark" indicators={false} interval={100000000}>
          <Carousel.Item className={styles.carouselItem}>
              <div className={styles.dFlex}>
                <TokenCardView
                  countL={3}
                  countR={10}
                  days={'121 days left'}
                  name={'Item Name'}
                  author={'Creat name'}
                  likesCount={99}
                  isSmall={false}
                  buttonText={'Place a bid 0.08 ETH'}
                  onClick={() => { alert('buy Place a bid 0.08 ETH') }} />
                <TokenCardView
                  countL={3}
                  countR={10}
                  days={'121 days left'}
                  name={'Item Name'}
                  author={'Creat name'}
                  likesCount={99}
                  isSmall={false}
                  buttonText={'Place a bid 0.08 ETH'}
                  onClick={() => { alert('buy Place a bid 0.08 ETH') }} />
              </div>
          </Carousel.Item>
        </Carousel>*/}

      </div>
    )
  }
}

export { CarouselView }