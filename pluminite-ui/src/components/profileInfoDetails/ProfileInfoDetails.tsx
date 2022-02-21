import React, {Component} from "react";
import {LabelView} from "../common/label/labelView";
import {buttonColors, ButtonView} from "../common/button/ButtonView";
import styles from './profileInfoDetails.module.css';

class ProfileInfoDetails extends Component {
  render() {
    return (
      <div className={styles.profileDetailsWrap}>
        <div className="d-flex align-items-center justify-content-between my-3">
          <LabelView  text={'Profile details'}/>
          <ButtonView
            text={'EDIT'}
            onClick={() => {  }}
            color={buttonColors.gold}
          />
        </div>
        <div>

        </div>
      </div>
    );
  }
}

export { ProfileInfoDetails };