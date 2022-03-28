import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './createCollection.module.css';
import MediaQuery from 'react-responsive';
import defaultPreview from '../../../assets/images/vine-def.png';
import { RenderType } from '../Collections';
import CollectionCard from '../collectionCard/CollectionCard';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { Spinner } from 'react-bootstrap';
import { nftStorage } from '../../../api/NftStorage';
import { IUploadFileResponse } from '../../../api/IUploadFileResponse';
import InputView, { ViewType } from '../../common/inputView/InputView';

interface ICreateCollection extends IProps {
  changeRenderType?: (type: RenderType) => void;
  isUpdate?: boolean;
}

class CreateCollection extends Component<ICreateCollection & IBaseComponentProps> {
  private _selectFile?: File;
  private _ref: React.RefObject<DropzoneRef>;
  private _refCover: React.RefObject<DropzoneRef>;
  private _fileResponse: IUploadFileResponse | undefined;
  private _imageRef: React.RefObject<any>;
  private _imageCoverRef: React.RefObject<any>;
  private _refInputDescription: any;
  private _refInputName: any;

  public state = {
    preview: { },
    isLoadFile: false,
    isLoadCoverFile: false,
  }

  constructor(props: ICreateCollection & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef<DropzoneRef>();
    this._refCover = React.createRef<DropzoneRef>();
    this._imageRef = React.createRef<any>();
    this._imageCoverRef = React.createRef<any>();

    if (!this.props.near.isAuth) {
      this.props.near.signIn();
    }
  }

  private changeRenderType(type: RenderType) {
    this.props.changeRenderType && this.props.changeRenderType(type);
  }

  private get isUpdate() {
    return this.props.isUpdate;
  }

  public setFile = async (files: Array<File>, typeLoad: string) => {
    this._selectFile = files[0];

    if (!this._selectFile) return;

    switch (typeLoad) {
      case 'base':
        this.setState({
          ...this.state,
          isLoadFile: true
        });

        this._fileResponse = await nftStorage.uploadFile(this._selectFile as File, 'name', 'descr');

        if (this._fileResponse && this._imageRef?.current) {
          this.setState({ ...this.state, file: this._fileResponse.url, isLoadFile: false });

          this._imageRef.current.src = this._fileResponse.url;
        }
        break;
      case 'cover':
        this.setState({
          ...this.state,
          isLoadCoverFile: true
        });

        this._fileResponse = await nftStorage.uploadFile(this._selectFile as File, 'name', 'descr');

        if (this._fileResponse && this._imageCoverRef?.current) {
          this.setState({ ...this.state, file: this._fileResponse.url, isLoadFile: false });

          this._imageCoverRef.current.src = this._fileResponse.url;
        }
        break;
    }
  };

  private openDialog = (ref: any) => {
    if (ref && ref.current) {
      ref.current.open();
    }
  }

  public render() {
    return (
      <div className={`container mb-5 ${this.isUpdate ? 'mt-4' : ''}`}>
        {!this.isUpdate && <h3 className={styles.title}>Create new collection</h3>}

        <div className={styles.contentWrap}>
          <MediaQuery minWidth={992}>
            <div className={styles.previewWrap}>
              <label className={styles.label}>Preview</label>

              <CollectionCard
                isPreview={true}
              />
            </div>
          </MediaQuery>

          <div className={styles.containerWrap}>
            <label className={styles.label}>Upload collection cover photo</label>
            <div className={styles.dropzone}>
              <Dropzone
                accept='image/*'
                onDrop={(e) => { this.setFile(e, 'cover') }}
                ref={this._ref}
                noClick
                noKeyboard
              >
                {({ getRootProps, getInputProps, acceptedFiles }) => {
                  return (
                    <div>
                      <div {...getRootProps({ className: `dropzone ${styles.customDropzone} ${styles.uploadForm}` })}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzoneControls}>
                          {acceptedFiles.length > 0 ? (
                            <img ref={this._imageRef} src='' alt='' />
                            ) : (
                              <>
                                <p className={styles.dropzoneTitle}>PNG, GIF, WEBP, MP4 or MP3. Max 100mb</p>
                                <ButtonView
                                  text={'Upload file'}
                                  onClick={() => { this.openDialog(this._ref); }}
                                  color={buttonColors.goldFill}
                                  customClass={styles.button}
                                />
                              </>
                            )}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Dropzone>

              {this.state.isLoadFile && (
                <div className={styles.spinnerWrap}><Spinner animation='grow' variant='light' /></div>
              )}
            </div>

            <label className={`${styles.label} mt-5`}>Upload collection main photo</label>
            <div className={styles.dropzone}>
              <Dropzone
                accept='image/*'
                onDrop={(e) => { this.setFile(e, 'base') }}
                ref={this._refCover}
                noClick
                noKeyboard
              >
                {({ getRootProps, getInputProps, acceptedFiles }) => {
                  return (
                    <div>
                      <div {...getRootProps({ className: `dropzone ${styles.customDropzone} ${styles.uploadForm}` })}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzoneControls}>
                          {acceptedFiles.length > 0 ? (
                            <img ref={this._imageCoverRef} src='' alt='' />
                          ) : (
                            <>
                              <p className={styles.dropzoneTitle}>PNG, GIF, WEBP, MP4 or MP3. Max 100mb</p>
                              <ButtonView
                                text={'Upload file'}
                                onClick={() => { this.openDialog(this._refCover); }}
                                color={buttonColors.goldFill}
                                customClass={styles.button}
                              />
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Dropzone>

              {this.state.isLoadFile && (
                <div className={styles.spinnerWrap}><Spinner animation='grow' variant='light' /></div>
              )}
            </div>

            <InputView
              onChange={(e) => {}}
              placeholder={'Collection Name *'}
              absPlaceholder={'Collection Name *'}
              customClass={`${styles.titleInpWrap} my-4`}
              value={this._refInputName && this._refInputName.value}
              isError={false}
              errorMessage={`Enter the name`}
              setRef={(ref) => {
                this._refInputName = ref;
              }}
            />

            <InputView
              onChange={(e) => {}}
              placeholder={'Description *'}
              absPlaceholder={'Description *'}
              customClass={`${styles.titleInpWrap} mb-4`}
              value={this._refInputDescription && this._refInputDescription.value}
              viewType={ViewType.textarea}
              isError={false}
              errorMessage={`Enter description in the correct format.`}
              setRef={(ref) => {
                this._refInputDescription = ref;
              }}
            />

            <div className='d-flex align-items-center justify-content-center mt-2'>
              <ButtonView
                text={'CANCEL'}
                onClick={() => { this.changeRenderType(RenderType.collectionList) }}
                color={buttonColors.gold}
              />
              <ButtonView
                text={'SUBMIT'}
                onClick={() => {}}
                color={buttonColors.goldFill}
                customClass={'min-w-100px'}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withComponent(CreateCollection);
