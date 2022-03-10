import React, { Component } from 'react';
import { ITokenResponseItem } from '../../types/ITokenResponseItem';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import styles from './MediaView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import { isVideoFile } from '../../utils/sys';

interface IMediaView extends IProps {
  model: ITokenResponseItem;
  alt?: string;
}

interface IMetadataExtra {
  media_lowres: string;
  creator_id: string;
  media_size: number;
  media_type: string;
}

interface IMetadataExtraState {
  preview: string;
  showVideo: boolean;
}

class MediaView extends Component<IMediaView & IBaseComponentProps, IMetadataExtraState> {

  private readonly _ref: React.RefObject<HTMLImageElement>;
  private readonly _isVideo: boolean;
  private readonly _url: string;
  private readonly _alt: string;

  constructor(props: IMediaView & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef();

    const extra: IMetadataExtra | null = this.props.model.metadata && this.props.model.metadata.extra ? JSON.parse(this.props.model.metadata.extra) : null;

    this._isVideo = extra === null ? false : isVideoFile(extra.media_type);
    this._url = extra === null || !extra.media_lowres ? this.props.model.metadata.media : extra.media_lowres;
    this._alt = this.props.alt || 'preview image ' + this.props.model.token_id;


    this.state = {
      showVideo: false,
      preview: extra === null || !extra.media_lowres ? this.props.model.metadata.media : extra.media_lowres,
      
    };
  }

  private get url() {
    return this._url;
  }

  public get isVideo() {
    return this._isVideo;
  }

  private setDefaultImage = () => {
    if (this._ref.current !== null) {
      this._ref.current.src = cardPreview;
    }
  }

  private onClick = async (e: React.MouseEvent<HTMLImageElement>) => {
    if (this._isVideo) {
      e.preventDefault();
      this.showVideo();
    }
  }

  private showVideo() {
    this.setState({
      ...this.state,
      showVideo: true
    });
  }

  public render() {
    return (
      this.state.showVideo ? (
        <video
          src={this.props.model.metadata.media}
          className="image"
          autoPlay
          muted
          loop
          /*ref={this._ref}*/
          onLoadedData={() => { }}
          onError={() => { }}
      />): (
        <img
          ref={this._ref}
          className={styles.imageStyle}
          src={this._url}
          onError={this.setDefaultImage}
          alt={this._alt}
          /*onClick={this.onClick}*/
      />
      )
    );
  }
}

export default withComponent(MediaView);
