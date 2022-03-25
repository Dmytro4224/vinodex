import style from './timer.module.css';
import { Component } from 'react';
import iconFire from '../../../assets/icons/fire.svg';

interface ITimer {
  type: TimerType;
  endDateTimestamp: number;
  onEndTimer?: () => void;
}

interface IState {
  days: number | string;
  hours: number | string;
  minutes: number | string;
  seconds: number | string;
}

export enum TimerType {
  big = 'big',
  small = 'small'
}

class Timer extends Component<ITimer> {
  private interval: any;
  private intervalMs: number = 1000;

  public state: IState = {
    days: `00`,
    hours: `00`,
    minutes: `00`,
    seconds: `00`,
  }

  constructor(props) {
    super(props);
  }

  public componentDidMount() {
    this.startTimer();
  }

  public componentWillUnmount() {
    this.clearTimer();
  }

  private clearTimer() {
    this.interval && clearInterval(this.interval);
  }

  private startTimer() {
    this.clearTimer();
    this.getLeftTime();

    this.interval = setInterval(() => {
      this.getLeftTime();
    }, this.intervalMs);
  }

  private stopTimer() {
    this.clearTimer();
    this.props.onEndTimer && this.props.onEndTimer();
  }

  private getLeftTime() {
    const second = 1000,
      minute = second * 60,
      hour = minute * 60,
      day = hour * 24;

    const diff = this.timestampEnd - new Date().getTime();

    if (diff < 0) {
      this.stopTimer();

      this.setState({
        ...this.state,
        days: `00`,
        hours: `00`,
        minutes: `00`,
        seconds: `00`,
      });
    } else {
      const d = Math.floor(diff / day),
        h = Math.floor((diff % day) / hour),
        m = Math.floor((diff % hour) / minute),
        s = Math.floor((diff % minute) / second);

      this.setState({
        ...this.state,
        days: d < 10 ? `0${d}` : d,
        hours: h < 10 ? `0${h}` : h,
        minutes: m < 10 ? `0${m}` : m,
        seconds: s < 10 ? `0${s}` : s
      })
    }
  }

  get timestampEnd() {
    return this.props.endDateTimestamp;
  }

  private getTimerType() {
    switch(this.props.type) {
      case TimerType.big:
        return (
          <div className={style.timerWrap}>
            <p>{this.state.days}</p>
            <span>:</span>
            <p>{this.state.hours}</p>
            <span>:</span>
            <p>{this.state.minutes}</p>
            <span>:</span>
            <p>{this.state.seconds}</p>
          </div>
        )
      case TimerType.small:
        return (
          <div className={style.timerWrapSmall}>
            <img src={iconFire} alt='fire' />

            <div className={style.numWrapSm}>
              <p>{this.state.days}</p>
              <span>:</span>
              <p>{this.state.hours}</p>
              <span>:</span>
              <p>{this.state.minutes}</p>
              <span>:</span>
              <p>{this.state.seconds}</p>
            </div>
          </div>
        )
    }
  }

  public render() {
    return this.getTimerType();
  }
}

export { Timer };
