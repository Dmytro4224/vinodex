import React from "react";
import { Component } from "react";
import { Form, FormCheck } from "react-bootstrap";
import Dropzone, { DropzoneRef } from "react-dropzone";
import { pinataAPI } from "../../api/Pinata";
import ButtonView, { buttonColors } from "../../components/common/button/ButtonView";
import InputView, { ViewType } from "../../components/common/inputView/InputView";
import {IBaseComponentProps, IProps, withComponent } from "../../utils/withComponent";
import styles from './createToken.module.css';

interface ICreateToken extends IProps{

}

class CreateToken extends Component<ICreateToken & IBaseComponentProps>{
  private _ref: React.RefObject<DropzoneRef>;

  constructor(props: ICreateToken & IBaseComponentProps) {
    super(props);

    this._ref = React.createRef<DropzoneRef>();
  }

  private openDialog = () => {
    if (this._ref.current) {
      this._ref.current.open();
    }
  }

  render(){
    return <div className={styles.container}>
        <div className={styles.containerWrap}>
          <h3 className={styles.title}>Create Single NFT</h3>
          <div className={styles.createWrap}>
            <label className={styles.label}>Upload file</label>
            <div className={styles.dropzone}>
              <Dropzone ref={this._ref} noClick noKeyboard>
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
              onChange={(e) => { console.log(e) }}
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
          </div>
        </div>
    </div>
  }
}

export default withComponent(CreateToken);