import { Component } from 'react';
import { unchainApi } from '../../api/UnchainApi';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import styles from './emailConfirmation.module.css';
import img from '../../assets/images/complete-subscribing.png';
import { Navigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

export enum EmailConfirmationTypeEnum {
  confirm = 'confirm',
  confirmed = 'confirmed',
  error = 'error'
}

interface IEmailConfirmation extends IProps {
  type: EmailConfirmationTypeEnum
}

interface IIEmailConfirmationState {
}

class EmailConfirmation extends Component<IEmailConfirmation & IBaseComponentProps, IIEmailConfirmationState, any> {

  constructor(props: IEmailConfirmation & IBaseComponentProps) {
    super(props);
  }

  public componentDidMount() {
    this.sendData();
  }

  public componentDidUpdate(prevProps: IEmailConfirmation & IBaseComponentProps) {
    if (this.props.type !== prevProps.type) {
      this.sendData();
    }
  }

  private isFromLanding() {
    const type = new URLSearchParams(document.location.search).get('type') || '';
    return type.localeCompare('landing', void 0, { sensitivity: 'accent' }) === 0;
  }

  private sendData() {
    const emailHash = this.props.params.hash!;
    const isFromLanding = this.isFromLanding();
    if (this.props.type === EmailConfirmationTypeEnum.confirm) {
      unchainApi.confirmation(emailHash)
        .then(response => {
          if (isFromLanding) {
            this.props.navigate(`/email-confirmation/${emailHash}/confirmed/?type=landing`);
          }
          else if (response === null || response.statusCode !== 200 || !response.data) {
            this.props.navigate(`/email-confirmation/${emailHash}/error`);
          }
          else {
            this.props.navigate(`/email-confirmation/${emailHash}/confirmed`);
          }
        })
        .catch(ex => {
          console.error(ex);
          this.props.navigate(`/email-confirmation/${emailHash}/error`);
        });
    }
    if (this.props.type === EmailConfirmationTypeEnum.confirmed) {
      unchainApi.welcome(emailHash, isFromLanding ? 1 : 0)
        .then(response => {
          console.log('confirmed response', response);
        })
        .catch(console.error);
    }
  }

  public render() {
    if (this.props.type === EmailConfirmationTypeEnum.confirm) {
      return (
        <div className={styles.wrapper}>
          <div className={styles.row1}>
            We confirm your email
          </div>
          <div className={styles.row2}>
            Please wait
          </div>
        </div>
      );
    }
    if (this.props.type === EmailConfirmationTypeEnum.confirmed) {
      return (
        <div className={styles.wrapConfirmed}>
          <div className={styles.confirmedTitle}>
            Thank you for subscribing!
          </div>
          <div className={styles.confirmedImage}>
            <img width="360" height="240" src={img} alt={'Thank you for subscribing!'} title={''} />
          </div>
          <div className={styles.confirmedDescription}>
            You have successfuly confirm your email and subctibed to out news.<br />
            We will write you a letter when we have interesting news just for you!
          </div>
          <div className={styles.confirmedHome}>
            <span>
              Go to
            </span>
            &nbsp;<NavLink className={styles.confirmedHomeLink} to={'/'}>
              Home page
            </NavLink>
          </div>
        </div>
      );
    }
    if (this.props.type === EmailConfirmationTypeEnum.error) {
      return (
        <div className={styles.errorWrap}>
          <div className={styles.confirmedTitle}>
            Invalid verification code
          </div>
          <div className={styles.confirmedDescription}>
            The verification code you are trying to use is invalid
          </div>
          <div className={styles.confirmedHome}>
            <span>
              Go to
            </span>
            &nbsp;<NavLink className={styles.confirmedHomeLink} to={'/'}>
              Home page
            </NavLink>
          </div>
        </div>
      );
    }
    return <div />;
  }
}

export default withComponent(EmailConfirmation);
