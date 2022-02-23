import React from "react";
import { Component } from "react";
import { Form, FormCheck } from "react-bootstrap";
import Dropzone, { DropzoneRef } from "react-dropzone";
import { pinataAPI } from "../../api/Pinata";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import InputView, { ViewType } from "../../components/common/inputView/InputView";
import { SelectView } from "../../components/common/select/selectView";
import { ITokenCreateItem } from "../../types/ITokenCreateItem";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import styles from './createToken.module.css';

interface ICreateToken extends IProps{

}

class CreateToken extends Component<ICreateToken & IBaseComponentProps>{
  private _ref: React.RefObject<DropzoneRef>;
  private _selectFile?: File;
  private _tokenObj: ITokenCreateItem;

  constructor(props: ICreateToken & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef<DropzoneRef>();

    this._tokenObj = {
      metadata: {
        copies: '',
        description: '',
        expires_at: '',
        extra: 0,
        issued_at: '',
        likes_count: 0,
        media: '',
        media_hash: '',
        price: 0,
        reference: 0,
        reference_hash: '',
        sold_at: '',
        starts_at: '',
        title: '',
        updated_at: '',
        views_count: 0
      },
      receiver_id: '',
      perpetual_royalties: null,
      token_id: '',
      token_type: ''
    }
  }

  private openDialog = () => {
    if (this._ref.current) {
      this._ref.current.open();
    }
  }

  public setSelectFile = async (files) => {
    this._selectFile = files[0];
    console.log(`this._selectFile`, this._selectFile);
  }

  render(){
    return <div className={styles.container}>
        <div className={styles.containerWrap}>
          <h3 className={styles.title}>Create Single NFT</h3>
          <div className={styles.createWrap}>
            <label className={styles.label}>Upload file</label>
            <div className={styles.dropzone}>
              <Dropzone onDrop={this.setSelectFile} ref={this._ref} noClick noKeyboard>
                {({getRootProps, getInputProps, acceptedFiles}) => {
                  return (
                    <div>
                      <div {...getRootProps({className: `dropzone ${styles.customDropzone}`})}>
                        <input {...getInputProps()} />
                        <div className={styles.dropzoneControls}>
                          <p className={styles.dropzoneTitle}>PNG, GIF, WEBP, MP4 or MP3. Max 100mb</p>
                          <ButtonView
                            text={'Upload file'}
                            onClick={() => { this.openDialog() }}
                            color={buttonColors.goldFill}
                            customClass={styles.button}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }}
              </Dropzone>
            </div>
            <InputView
              onChange={(e) => { }}
              placeholder={'Title*'}
              customClass={`mb-4 ${styles.titleInpWrap}`}
              viewType={ViewType.input}
            />
            <p></p>
            <Form>
              <FormCheck.Label htmlFor="switch-nft-approve" className="w-100">
                <div className={`d-flex align-items-center w-100 cursor-pointer justify-content-between ${styles.itemWrap}`}>
                  <div>
                    <p className={styles.itemTitle}>Put on marketplace</p>
                  </div>

                  <Form.Check
                    type="switch"
                    id="switch-nft-approve"
                    label=""
                  />
                </div>
              </FormCheck.Label>
            </Form>
            <div className={styles.checkboxes}>
              <Form className="d-flex align-items-center flex-gap-36">
                <div key={1} className="mb-3">
                  <Form.Check type={'radio'} id={`check-fixed`} name='checkbox'>
                    <Form.Check.Input type={'radio'} name='checkbox' />
                    <Form.Check.Label>{`Fixed price`}</Form.Check.Label>
                  </Form.Check>
                </div>
                <div key={2} className="mb-3">
                  <Form.Check type={'radio'} id={`check-auction`} name='checkbox'>
                    <Form.Check.Input type={'radio'} name='checkbox' />
                    <Form.Check.Label>{`Timed auction`}</Form.Check.Label>
                  </Form.Check>
                </div>
                <div key={3} className="mb-3">
                  <Form.Check type={'radio'} id={`check-Unlimited`} name='checkbox'>
                    <Form.Check.Input type={'radio'} name='checkbox' />
                    <Form.Check.Label>{`Unlimited auction`}</Form.Check.Label>
                  </Form.Check>
                </div>
              </Form>
            </div>
            <div className={styles.copies}>
              <label className={styles.inputLabel}>Enter price to allow users instantly purchase your NFT</label>
              <SelectView options={[
                { value: '1', label: '1' },
                { value: '2', label: '2' },
                { value: '3', label: '3' }
              ]} placeholder={'Number of copies*'} onChange={(opt) => { console.log(opt) }} />
            </div>
            <div>
              <InputView
                onChange={(e) => { console.log(e) }}
                placeholder={'Royalties*'}
                customClass={`${styles.titleInpWrap}`}
                viewType={ViewType.input}
              />
              <p className={styles.inputSubText}>Minimum 0%, maximum 100%</p>
            </div>
            <div className={styles.categories}>
              <SelectView options={this.props.near.catalogs.map(catalog => {
                  return {
                    value: catalog,
                    label: catalog
                  }
                })} placeholder={'Number of copies*'} onChange={(opt) => { console.log(opt) }} />
            </div>
            <div>
              <InputView
                onChange={(e) => { console.log(e) }}
                placeholder={'Description*'}
                customClass={`${styles.titleInpWrap}`}
                viewType={ViewType.input}
              />
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-center">
            <ButtonView
              text={'CANCEL'}
              onClick={() => { this.props.navigate(-1) }}
              color={buttonColors.gold}
            />
            <ButtonView
              text={'SUBMIT'}
              onClick={this.submit}
              color={buttonColors.goldFill}
            />
          </div>
        </div>
    </div>
  }




  private submit = async () => {
      if(this._selectFile === undefined){
        return;
      }

      const response = await pinataAPI.uploadFile(this._selectFile as File);

      console.log(`response`, response);
  }
}

export default withComponent(CreateToken);