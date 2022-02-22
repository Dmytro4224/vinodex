import { Component, useRef } from 'react';
import styles from './carouselView.module.css';
import { TokenCardView } from '../tokenCard/tokenCardView';
import next from '../../assets/icons/arrow-slider-right.svg';
import prev from '../../assets/icons/arrow-slider-left.svg';
// @ts-ignore
import Slider from "react-slick";

interface ICarouselView{
  customCLass: string,
  childrens: any[]
}

class SampleNextArrow extends Component<Readonly<any>>{
  constructor(props: any) {
    super(props);
  }

  render(){
    return (
      <div className={this.props.className}
           style={{ ...this.props.style, display: "block" }} onClick={this.props.onClick}><img src={next} alt={''}/></div>
    );
  }
}

class SamplePrevArrow extends Component<Readonly<any>>{
  constructor(props: any) {
    super(props);
  }

  render(){
    return (
      <div className={this.props.className}
           style={{ ...this.props.style, display: "block" }} onClick={this.props.onClick}><img src={prev} alt={''}/></div>
    );
  }
}

class CarouselView extends Component<Readonly<ICarouselView>>{
  constructor(props: ICarouselView) {
    super(props);
  }

  private get settings(){
    let settings = {
      infinite: true,
      speed: 500,
      slidesToShow: this.props.childrens.length > 1 ? 2 : 1,
      currentslide: 1,
      dots: false,
      nextArrow: <SampleNextArrow {...this.props} />, //this.SampleNextArrow(),
      prevArrow: <SamplePrevArrow {...this.props} /> //this.SamplePrevArrow()
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

export {CarouselView};
