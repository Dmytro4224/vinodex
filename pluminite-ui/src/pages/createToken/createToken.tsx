import React from "react";
import { Component } from "react";
import { Form, FormCheck } from "react-bootstrap";
import Dropzone, { DropzoneRef } from "react-dropzone";
import { pinataAPI } from "../../api/Pinata";
import { IUploadFileResponse } from "../../api/IUploadFileResponse";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import InputView, { ViewType } from "../../components/common/inputView/InputView";
import { ISelectViewItem, SelectView } from "../../components/common/select/selectView";
import { ITokenCreateItem } from "../../types/ITokenCreateItem";
import { IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import defaultImage from '../../assets/icons/card-preview.jpg';
import styles from './createToken.module.css';
import { validateDotNum } from "../../utils/sys";
import { APP } from '../../constants';
import { transactions } from 'near-api-js';
import { nftStorage } from '../../api/NftStorage';

interface ICreateToken extends IProps {

}

class CreateToken extends Component<ICreateToken & IBaseComponentProps>{
  private _ref: React.RefObject<DropzoneRef>;
  private _refInputTitle: any;
  private _refInputDescription: any;
  private _refInputPrice: any;
  private _refPriceSelect: any;
  private _refRoyalitiesInput: any;
  private _refInputBids: any;
  private _refCatalogSelect: any;
  private _refStartDate: any;
  private _refExpDate: any;
  private _refPutOnMarket: any;
  private _refTypePrice: Array<any> = [];
  private _selectFile?: File;
  private _fileResponse: IUploadFileResponse | undefined
  private _imageRef: React.RefObject<HTMLImageElement>;
  private _renderType: number

  public state = {
    file: null,
    title: "",
    putOnMarket: false,
    price: 0,
    royaltes: 0,
    category: null,
    description: '',
    bid: 0,
    startDate: '',
    expDate: '',
    validate: {
      isFileValid: true,
      isTitleValid: true,
      isPriceValid: true,
      isBidsValid: true,
      isRoyaltiesValid: true,
      isDescrValid: true
    }
  }

  constructor(props: ICreateToken & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef<DropzoneRef>();
    this._imageRef = React.createRef<HTMLImageElement>();
    this._renderType = 1;

    if (!this.props.near.isAuth) {
      this.props.near.signIn();
    }
  }

  private openDialog = () => {
    if (this._ref.current) {
      this._ref.current.open();
    }
  }

  public setSelectFile = async (files: Array<File>) => {
    console.log('setSelectFile', files);

    this._selectFile = files[0];

    if (this._selectFile === undefined) { return }

    this._fileResponse = await nftStorage.uploadFile(this._selectFile as File, 'name', 'descr');
    //return;

    //this._fileResponse = await nftStorage.uploadFile(this._selectFile as File);
    //console.log('nftStorege response', this._fileResponse);

    //this._fileResponse = await pinataAPI.uploadFile(this._selectFile as File);
    //console.log('_fileResponse', this._fileResponse);
    if (this._fileResponse && this._imageRef?.current) {
      //this._imageRef.current.src = pinataAPI.createUrl(this._fileResponse.IpfsHash);
      this._imageRef.current.src = this._fileResponse.url;
    }
  }

  private setMState(renderType: number) {
    this._renderType = renderType;

    let state = {
      description: this._refInputDescription.value,
      category: this._refCatalogSelect.value,
      royaltes: this._refRoyalitiesInput.value,
      title: this._refInputTitle.value,
      file: this._fileResponse !== undefined ? pinataAPI.createUrl(this._fileResponse.IpfsHash) : null,
      putOnMarket: this._refPutOnMarket.checked,
      price: 0,
      startDate: '',
      expDate: ''
    }

    switch (this._renderType) {
      case 1:
        state.price = this._refInputPrice.value;
        break;
      case 2:

        break;
      case 3:

        break;
    }

    this.setState({
      ...this.state,
      ...state
    })
  }

  public render() {
    return (<div className={styles.container}>
      <div className={styles.containerWrap}>
        <h3 className={styles.title}>Create Single NFT</h3>
        <div className={styles.createWrap}>
          <label className={styles.label}>Upload file</label>
          <div className={styles.dropzone}>
            <Dropzone onDrop={this.setSelectFile} ref={this._ref} noClick noKeyboard>
              {({ getRootProps, getInputProps, acceptedFiles }) => {
                return (
                  <div>
                    <div {...getRootProps({ className: `dropzone ${styles.customDropzone} ${styles.uploadForm}` })}>
                      <input {...getInputProps()} />
                      <div className={styles.dropzoneControls}>
                        {acceptedFiles.length > 0 ?
                          <img ref={this._imageRef} src={defaultImage} /> :
                          <><p className={styles.dropzoneTitle}>PNG, GIF, WEBP, MP4 or MP3. Max 100mb</p><ButtonView
                            text={'Upload file'}
                            onClick={() => {
                              this.openDialog();
                            }}
                            color={buttonColors.goldFill}
                            customClass={styles.button} /></>
                        }

                      </div>
                    </div>
                  </div>
                );
              }}
            </Dropzone>
          </div>
          <InputView
            onChange={(e) => {  }}
            placeholder={'Title*'}
            absPlaceholder={'Title*'}
            customClass={`mb-4 ${styles.titleInpWrap}`}
            viewType={ViewType.input}
            setRef={(ref) => { this._refInputTitle = ref; }}
            value={this._refInputTitle && this._refInputTitle.value}
            isError={!this.state.validate.isTitleValid}
            errorMessage={`Enter title in the correct format.`}
          />
          <p></p>
          <Form>
            <FormCheck.Label className={`w-100 ${styles.priceTypeLabel}`} htmlFor="switch-nft-approve">
              <div className={`d-flex align-items-center w-100 cursor-pointer justify-content-between ${styles.itemWrap}`}>
                <div>
                  <p className={styles.itemTitle}>Put on marketplace</p>
                </div>

                <Form.Check
                  type="switch"
                  id="switch-nft-approve"
                  ref={(ref) => { this._refPutOnMarket = ref }}
                  label=""
                />
              </div>
            </FormCheck.Label>
          </Form>
          <div className={styles.checkboxes}>
            <Form className={`d-flex align-items-center flex-gap-36 ${styles.formChecked}`}>
              <div key={1} className={`mb-3 ${styles.checkItem}`}>
                <Form.Check className="pl-0" type={'radio'} id={`check-fixed`} name='checkbox'>
                  <Form.Check.Input onChange={() => { this.setMState(1) }} id="inp-field-check" className={`d-none ${styles.priceTypeInput}`} ref={(ref) => { this._refTypePrice[0] = ref }} type={'radio'} name='checkbox' />
                  <Form.Check.Label htmlFor="inp-field-check" className={styles.priceTyleLabel}>
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <i className={`${styles.icon} ${styles.fixedPriceIcon}`}></i>
                      <p className="mt-1">Fixed price</p>
                    </div>
                  </Form.Check.Label>
                </Form.Check>
              </div>
              <div key={2} className={`mb-3 ${styles.checkItem}`}>
                <Form.Check className="pl-0" type={'radio'} id={`check-auction`} name='checkbox'>
                  <Form.Check.Input onChange={() => { this.setMState(2) }} className={`d-none ${styles.priceTypeInput}`} ref={(ref) => { this._refTypePrice[1] = ref }} type={'radio'} name='checkbox' />
                  <Form.Check.Label className={styles.priceTyleLabel}>
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <i className={`${styles.icon} ${styles.timedAuctionIcon}`}></i>
                      <p className="mt-1">Timed auction</p>
                    </div>
                  </Form.Check.Label>
                </Form.Check>
              </div>
              <div key={3} className={`mb-3 ${styles.checkItem}`}>
                <Form.Check className="pl-0" type={'radio'} id={`check-Unlimited`} name='checkbox'>
                  <Form.Check.Input onChange={() => { this.setMState(3) }} className={`d-none ${styles.priceTypeInput}`} ref={(ref) => { this._refTypePrice[2] = ref }} type={'radio'} name='checkbox' />
                  <Form.Check.Label className={styles.priceTyleLabel}>
                    <div className="d-flex align-items-center justify-content-center flex-column">
                      <i className={`${styles.icon} ${styles.unlimitedAuctionIcon}`}></i>
                      <p className="mt-1">Unlimited auction</p>
                    </div></Form.Check.Label>
                </Form.Check>
              </div>
            </Form>
          </div>
          {this._renderType === 1 ?
            <div className={styles.copies}>
              <label className={styles.inputLabel}>Enter price to allow users instantly purchase your NFT</label>
              <InputView
                onChange={(e) => { validateDotNum(e.target) }}
                placeholder={'Price*'}
                absPlaceholder={'Price*'}
                customClass={`${styles.titleInpWrap}`}
                viewType={ViewType.input}
                setRef={(ref) => { this._refInputPrice = ref; }}
                value={this._refInputPrice && this._refInputPrice.value}
                isError={!this.state.validate.isPriceValid}
                errorMessage={`Enter price in the correct format.`}
              />
              <p className={styles.inputSubText}>Service fee: <b>2.5%</b>, You will recive: <b>0.00 NEAR</b></p>
            </div> : this._renderType === 2 ? <div className={styles.copies}>
              <label className={styles.inputLabel}>Bids below this amount won’t be allowed</label>
              <InputView
                onChange={(e) => { validateDotNum(e.target) }}
                placeholder={'Minimum bid**'}
                absPlaceholder={'Minimum bid**'}
                customClass={`${styles.titleInpWrap}`}
                viewType={ViewType.input}
                setRef={(ref) => { this._refInputBids = ref; }}
                value={this._refInputBids && this._refInputBids.value}
                isError={!this.state.validate.isBidsValid}
                errorMessage={`Enter minimum bid in the correct format.`}
              />
              <div className={'mt-4'}>
                <label className={styles.inputLabel}>Set a period of time for which buyers can place bids</label>
                <div className={'d-flex align-items-centerjustify-content-between flex-gap-36 mt-3'}>
                  <Form.Control
                    type="date"
                    id="date-start"
                    placeholder={'Starting Date*'}
                    ref={(ref) => { }}
                  />
                  <Form.Control
                    type="date"
                    id="date-exp"
                    placeholder={'Expiration Date*'}
                    ref={(ref) => { }}
                  />
                </div>
              </div>
            </div> : <div></div>
          }

          <div>
            <InputView
              onChange={(e) => { validateDotNum(e.target) }}
              placeholder={'Royalties*'}
              absPlaceholder={'Royalties*'}
              customClass={`${styles.titleInpWrap}`}
              viewType={ViewType.input}
              value={this._refRoyalitiesInput && this._refRoyalitiesInput.value}
              isError={!this.state.validate.isRoyaltiesValid}
              errorMessage={`Enter royalties in the correct format.`}
              setRef={(ref) => { this._refRoyalitiesInput = ref; }}
            />
            <p className={styles.inputSubText}>Minimum 0%, maximum 100%</p>
          </div>
          <div className={styles.categories}>
            <SelectView options={this.props.near.catalogs.map(catalog => {
              return {
                value: catalog,
                label: catalog
              }
            })}
              customCLass={styles.selectStyle}
              placeholder={'Category'}
              onChange={(opt) => { console.log(opt) }}
              setRef={(ref) => { this._refCatalogSelect = ref; }}
            />
          </div>
          <div>
            <InputView
              onChange={(e) => { console.log(e) }}
              placeholder={'Description*'}
              absPlaceholder={'Description*'}
              customClass={`${styles.titleInpWrap}`}
              value={this._refInputDescription && this._refInputDescription.value}
              viewType={ViewType.input}
              isError={!this.state.validate.isDescrValid}
              errorMessage={`Enter description in the correct format.`}
              setRef={(ref) => { this._refInputDescription = ref; }}
            />
          </div>
        </div>
        <div className="d-flex align-items-center justify-content-center mt-2">
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
    </div>)
  }

  private isValidForm() {
    let validInfo = {
      file: true,
      title: true,
      price: true,
      royal: true,
      descr: true,
      bids: true,
    };

    if (this._fileResponse === undefined) {
      validInfo.file = false;
    }

    if (this._refInputTitle.value.trim() === '') {
      validInfo.title = false;
    }

    if (this._renderType === 1 && this._refInputPrice.value === '') {
      validInfo.price = false;
    }

    if (this._renderType === 2 && this._refInputBids.value === '') {
      validInfo.bids = false;
    }

    if (this._refRoyalitiesInput.value === '') {
      validInfo.royal = false;
    }

    if (this._refInputDescription.value.trim() === '') {
      validInfo.descr = false;
    }

    if (!validInfo.file || !validInfo.title || !validInfo.price || !validInfo.descr || !validInfo.bids || !validInfo.royal) {
      this.setState({
        ...this.state,
        validate: {
          isFileValid: validInfo.file,
          isTitleValid: validInfo.title,
          isPriceValid: validInfo.price,
          isBidsValid: validInfo.bids,
          isRoyaltiesValid: validInfo.royal,
          isDescrValid: validInfo.descr
        }
      })

      return false;
    }

    return true;
  }

  private submit = async () => {

    if (!this.isValidForm()) return;

    const title: string = this._refInputTitle.value;
    const description: string = this._refInputDescription.value;
    const catalog: ISelectViewItem | null = this._refCatalogSelect.selectedOption;
    const price = parseFloat(this._refInputPrice.value);

    if (this._fileResponse === undefined) { return }

    const url = this._fileResponse.url || pinataAPI.createUrl(this._fileResponse.IpfsHash);

    const metadata = {
      copies: '1',
      description: description,
      expires_at: null,
      extra: JSON.stringify({
        //media_lowres: '',
        creator_id: this.props.near.user!.accountId,
        media_size: this._selectFile!.size,
        media_type: this._selectFile!.type
      }),
      issued_at: null,
      likes_count: 0,
      media: url,
      media_hash: this._fileResponse.IpfsHash,
      price: price,
      reference: APP.HASH_SOURCE,
      reference_hash: null,
      sold_at: null,
      starts_at: null,
      title: title,
      updated_at: null,
      views_count: 0
    };

    const tokenId = `${this._fileResponse.IpfsHash}-${new Date().getTime()}`;

    const model = {
      metadata,
      receiver_id: null,
      perpetual_royalties: null,
      token_id: tokenId,
      token_type: catalog?.value
    };

    const isFreeMintAvailable = false;
    const nftContract = this.props.nftContractContext.nftContract!;

    //@ts-ignore
    const res = await nftContract.account.signAndSendTransaction(nftContract.contractId, [
      transactions.functionCall(
        'nft_mint',
        model,
        APP.PREPAID_GAS_LIMIT_HALF,
        APP.USE_STORAGE_FEES || !isFreeMintAvailable ? '30000000000000000000000' : '0'
      ),
      /*transactions.functionCall(
        'nft_approve',
        Buffer.from(
          JSON.stringify({
            token_id: tokenId,
            account_id: getMarketContractName(nftContract.contractId),
            msg: JSON.stringify({
              sale_conditions: [
                {
                  price: nft?.conditions?.near || '0',
                  ft_token_id: 'near',
                },
              ],
            }),
          })
        ),
        APP.PREPAID_GAS_LIMIT_HALF,
        APP.USE_STORAGE_FEES ? marketContractState.minStorage : 1
      ),*/
    ]);

    console.log(`create response`, res);
  }
}

export default withComponent(CreateToken);
