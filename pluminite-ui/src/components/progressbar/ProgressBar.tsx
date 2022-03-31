import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import styles from './ProgressBar.module.css';

export interface IProgressBarProps extends IProps {
  current?: number;
  onComplete?: () => void;
  setRef?: (impl: IProgressBar) => void;
}

export interface IProgressBarState {
}

export interface IProgressBar {
  start: () => void;
  run: () => void;
}

class ProgressBar extends Component<IProgressBarProps & IBaseComponentProps, IProgressBarState> implements IProgressBar {

  private readonly _barRef: React.RefObject<HTMLDivElement>;
  private _current: number;

  constructor(props: IProgressBarProps & IBaseComponentProps) {
    super(props);

    this._barRef = React.createRef();
    this._current = this.props.current || 0;

    if (this.props.setRef !== void 0) {
      this.props.setRef(this);
    }
  }

  public start() {
    this._current = 0;
    this.run();
  }

  public async run() {
    while (this._current <= 100 && this._barRef.current !== null) {
      this._current++;
      this._barRef.current.style.width = `${this._current}%`;
      await this.sleep(50);
    }
    this.onComplete();
  }

  private sleep(ms: number) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }

  private onComplete = async () => {
    if (this.props.onComplete !== void 0) {
      this.props.onComplete();
    }
  }

  public render() {
    return (
      <div className={styles.wrapper}>
        <div ref={this._barRef} className={styles.current}></div>
      </div>
    );
  }
}

export default withComponent(ProgressBar);
