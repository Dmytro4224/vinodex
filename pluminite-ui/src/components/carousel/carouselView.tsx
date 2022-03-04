import { Component, useRef } from 'react';
import styles from './carouselView.module.css';
import TokenCardView from '../tokenCard/tokenCardView';
import next from '../../assets/icons/arrow-slider-right.svg';
import prev from '../../assets/icons/arrow-slider-left.svg';
import Slider from "react-slick";
import {IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';

interface ICarouselView extends IProps{
  customCLass: string,
  childrens: any[]
}

interface ISampleNextArrow extends IProps{
  className: string;
  style: {[key: string]:string};
  onClick: () => void
}

class SampleNextArrow extends Component<ISampleNextArrow & IBaseComponentProps>{
  constructor(props: ISampleNextArrow & IBaseComponentProps) {
    super(props);
  }

  render(){
    return (
      <div className={this.props.className}
           style={{ ...this.props.style, display: "block" }} onClick={this.props.onClick}><img src={next} alt={''}/></div>
    );
  }
}

class SamplePrevArrow extends Component<ISampleNextArrow & IBaseComponentProps>{
  constructor(props: ISampleNextArrow & IBaseComponentProps) {
    super(props);
  }

  render(){
    return (
      <div className={this.props.className}
           style={{ ...this.props.style, display: "block" }} onClick={this.props.onClick}><img src={prev} alt={''}/></div>
    );
  }
}

class CarouselView extends Component<ICarouselView & IBaseComponentProps>{
  constructor(props: ICarouselView & IBaseComponentProps) {
    super(props);
  }

  private get settings(){
    let settings = {
      infinite: true,
      speed: 500,
      slidesToShow: this.props.childrens.length > 1 ? 2 : 1,
      currentslide: 1,
      dots: false,
      adaptiveHeight: false,
      draggable: false,
      nextArrow: <SampleNextArrow {...(this.props as any)} />, //this.SampleNextArrow(),
      prevArrow: <SamplePrevArrow {...(this.props as any)} />, //this.SamplePrevArrow()
      responsive: [
        {
          breakpoint: 991,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            nextArrow: false,
            prevArrow: false
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            nextArrow: false,
            prevArrow: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
            nextArrow: false,
            prevArrow: false
          }
        }
      ]
    };

    return settings;
  }

  render(){
    return (
      <div className={`${styles.carouselWrap} ${this.props.customCLass || ''}`}>
        <Slider {...this.settings} className={styles.gap}>
          {this.props.childrens.map(ch => ch)}
        </Slider>
      </div>
    )
  }
}

export default withComponent(CarouselView);
