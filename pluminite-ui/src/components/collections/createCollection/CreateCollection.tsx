import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import styles from './createCollection.module.css';
import MediaQuery from 'react-responsive';
import { RenderType } from '../Collections';
import CollectionCard from '../collectionCard/CollectionCard';
import Dropzone, { DropzoneRef } from 'react-dropzone';
import ButtonView, { buttonColors } from '../../common/button/ButtonView';
import { Spinner } from 'react-bootstrap';
import { nftStorage } from '../../../api/NftStorage';
import { IUploadFileResponse } from '../../../api/IUploadFileResponse';
import InputView, { ViewType } from '../../common/inputView/InputView';
import { ICollectionResponseItem } from '../../../types/ICollectionResponseItem';

interface ICreateCollection extends IProps {
  changeRenderType?: (type: RenderType) => void;
  collectionData?: ICollectionResponseItem | null;
}

type StateType = {
  preview: ICollectionResponseItem,
  isLoadFile: boolean,
  isLoadCoverFile: boolean,
  isCreating: boolean,
  validation: {
    isValidCover: boolean,
    isValidImage: boolean,
    isValidName: boolean,
    isValidDescription:boolean,
  }
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

  public state: StateType = {
    preview: {
      cover_photo: this.props.collectionData?.cover_photo || '',
      description: this.props.collectionData?.description || '',
      is_active: true,
      name: this.props.collectionData?.name || '',
      owner: null,
      profile_photo: this.props.collectionData?.profile_photo || '',
      tokens: null,
    },
    isLoadFile: false,
    isLoadCoverFile: false,
    isCreating: false,
    validation: {
      isValidCover: true,
      isValidImage: true,
      isValidName: true,
      isValidDescription: true
    }
  }

  constructor(props: ICreateCollection & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef<DropzoneRef>();
    this._refCover = React.createRef<DropzoneRef>();
    this._imageRef = React.createRef<any>();
    this._imageCoverRef = React.createRef<any>();
  }

  public componentDidMount() {
    if (!this.props.near.isAuth) {
      this.props.near.signIn();
    }

    if (this.props.collectionData) {
      try {
        this._refInputName._ref.current.value = this.props.collectionData.name;
        this._refInputDescription._ref.current.value = this.props.collectionData.description;
      } catch (e) { console.warn(e) }
    }
  }

  private changeRenderType(type: RenderType) {
    this.props.changeRenderType && this.props.changeRenderType(type);
  }

  private get isUpdate() {
    return this.props.collectionData !== null && typeof this.props.collectionData !== 'undefined';
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

          this.setState({
            ...this.state,
            isLoadFile: false,
            preview: {
              ...this.state.preview,
              profile_photo: this._fileResponse.url
            }
          });

          this._imageRef.current.src = this._fileResponse.url;
          this._imageRef.current.removeAttribute('hidden');
        }
        break;
      case 'cover':
        this.setState({
          ...this.state,
          isLoadCoverFile: true
        });

        this._fileResponse = await nftStorage.uploadFile(this._selectFile as File, 'name', 'descr');

        if (this._fileResponse && this._imageCoverRef?.current) {
          this.setState({
            ...this.state,
            isLoadCoverFile: false,
            preview: {
              ...this.state.preview,
              cover_photo: this._fileResponse.url
            },
          });

          this._imageCoverRef.current.src = this._fileResponse.url;
          this._imageCoverRef.current.removeAttribute('hidden');
        }
        break;
    }
  };

  private openDialog = (ref: any) => {
    if (ref && ref.current) {
      ref.current.open();
    }
  }

  private createCollection = async () => {
    if (!this.isValid()) return;

    this.setState({
      ...this.state,
      isCreating: true
    })

    if (this.isUpdate) {
      this.setState({
        ...this.state,
        isCreating: false
      })
    } else {
      const time = new Date().getTime();

      this.props.nftContractContext.collection_add(
        this._refInputName.value.trim(),
        this._refInputDescription.value.trim(),
        this._imageRef?.current?.src,
        this._imageCoverRef?.current?.src,
        time
      ).then(res => {
        this.changeRenderType(RenderType.collectionList);
      })
    }
  }

  private isValid() {
    const validData = {
      isCoverValid: true,
      isImageValid: true,
      isNameValid: true,
      isDescriptionValid: true,
    }

    if (!this.isUpdate) {
      if (!this._imageCoverRef?.current?.src) {
        validData.isCoverValid = false;
      }

      if (!this._imageRef?.current?.src) {
        validData.isImageValid = false;
      }
    }

    if (!this._refInputName.value) {
      validData.isNameValid = false;
    }

    if (!this._refInputDescription.value) {
      validData.isDescriptionValid = false;
    }

    if (
      !validData.isCoverValid ||
      !validData.isImageValid ||
      !validData.isNameValid ||
      !validData.isDescriptionValid
    ) {
      this.setState({
        ...this.state,
        validation: {
          ...this.state.validation,
          isValidCover: validData.isCoverValid,
          isValidImage: validData.isImageValid,
          isValidName: validData.isNameValid,
          isValidDescription: validData.isDescriptionValid
        }
      })

      return false;
    }

    return true;
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
                data={this.state.preview}
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
                ref={this._refCover}
                noClick
                noKeyboard
              >
                {({ getRootProps, getInputProps, acceptedFiles }) => {
                  return (
                    <div /* onClick={() => { this.openDialog(this._ref); }} */ >
                      <div {...getRootProps({ className: `dropzone ${styles.customDropzone} ${styles.uploadForm}` })}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzoneControls}>
                          <img hidden ref={this._imageCoverRef} />

                          {acceptedFiles.length > 0 ? (
                            <></>
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

              {this.state.isLoadCoverFile && (
                <div className={styles.spinnerWrap}><Spinner animation='grow' variant='light' /></div>
              )}
            </div>

            <label className={`${styles.label} mt-5`}>Upload collection main photo</label>
            <div className={styles.dropzone}>
              <Dropzone
                accept='image/*'
                onDrop={(e) => { this.setFile(e, 'base') }}
                ref={this._ref}
                noClick
                noKeyboard
              >
                {({ getRootProps, getInputProps, acceptedFiles }) => {
                  return (
                    <div /* onClick={() => { this.openDialog(this._refCover); }} */ >
                      <div {...getRootProps({ className: `dropzone ${styles.customDropzone} ${styles.uploadForm}` })}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzoneControls}>
                          <img hidden ref={this._imageRef} />

                          {acceptedFiles.length > 0 ? (
                            <></>
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

            <InputView
              placeholder={'Collection Name *'}
              absPlaceholder={'Collection Name *'}
              customClass={`${styles.titleInpWrap} my-4`}
              value={this._refInputName && this._refInputName.value}
              isError={!this.state.validation.isValidName}
              errorMessage={`Enter the name`}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  preview: {
                    ...this.state.preview,
                    name: this._refInputName.value.trim()
                  }
                })
              }}
              setRef={(ref) => {
                this._refInputName = ref;
              }}
            />

            <InputView
              placeholder={'Description *'}
              absPlaceholder={'Description *'}
              customClass={`${styles.titleInpWrap} mb-4`}
              value={this._refInputDescription && this._refInputDescription.value}
              viewType={ViewType.textarea}
              isError={!this.state.validation.isValidDescription}
              errorMessage={`Enter description`}
              onChange={(e) => {
                this.setState({
                  ...this.state,
                  preview: {
                    ...this.state.preview,
                    description: this._refInputDescription.value.trim()
                  }
                })
              }}
              setRef={(ref) => {
                this._refInputDescription = ref;
              }}
            />

            {(!this.state.validation.isValidCover || !this.state.validation.isValidImage) && (
              <p className='errorMessage mt-2'>You need to upload a background photo and the main picture of the collection</p>
            )}

            <div className='d-flex align-items-center justify-content-center mt-2'>
              <ButtonView
                text={'CANCEL'}
                onClick={() => { this.changeRenderType(RenderType.collectionList) }}
                color={buttonColors.gold}
                disabled={this.state.isCreating}
              />
              <ButtonView
                text={'SUBMIT'}
                onClick={this.createCollection}
                color={buttonColors.goldFill}
                customClass={'min-w-100px'}
                isLoading={this.state.isCreating}
                disabled={this.isUpdate}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withComponent(CreateCollection);
