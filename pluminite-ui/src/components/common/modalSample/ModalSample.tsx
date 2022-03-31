import {Component} from "react";
import {Modal} from "react-bootstrap";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";
import styles from './modalSample.module.css';

interface IModalSample extends IProps {
  modalTitle: string
  children: any;
  isShow: boolean;
  onHide: () => void;
  size?: ModalSampleSizeType;
  buttons?: any;
  customClass?: string;
  hasCloseButton?: boolean;
  alignButtons?: 'right' | 'center' | 'left';
}

enum ModalSampleSizeType {
    xl = "xl",
    lg = "lg",
    sm = "sm"
}

class ModalSample extends Component<IModalSample & IBaseComponentProps> {
  constructor(props: IModalSample & IBaseComponentProps) {
    super(props);
  }

  private get modalTitle() {
    return this.props.modalTitle;
  }

  private get children() {
    return this.props.children;
  }

  private get buttons() {
    return this.props.buttons;
  }

  private get isShow() {
    return this.props.isShow;
  }

  private onHide() {
    this.props.onHide()
  }

  private get size() {
    return this.props.size;
  }

  private get hasCloseButton() {
    return this.props.hasCloseButton !== void 0 ? this.props.hasCloseButton : true;
  }

  private get alignButtonsClassName() {
    if (this.props.alignButtons === 'center') {
      return 'justify-content-center';
    }
    if (this.props.alignButtons === 'left') {
      return 'justify-content-start';
    }
    return 'justify-content-end';
  }

  public render() {
    return (
      <Modal
        show={this.isShow}
        onHide={() => { this.onHide() }}
        size={this.size}
        className={`${styles.modal} ${this.props.customClass ? this.props.customClass : ''}`}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton={this.hasCloseButton} className={styles.borderNone}>
          <Modal.Title className={styles.modalTitle}>
            { this.modalTitle }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.children }
        </Modal.Body>
        <Modal.Footer className={`${styles.borderNone} ${this.alignButtonsClassName}`}>
          { this.buttons }
        </Modal.Footer>
      </Modal>
    );
  }
}
export default withComponent(ModalSample);
export { ModalSampleSizeType };
