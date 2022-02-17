import {Component} from "react";
import {Modal} from "react-bootstrap";
import styles from './modalSample.module.css';

interface IModalSample {
  modalTitle: string
  children: any;
  isShow: boolean;
  onHide: () => void;
  size: ModalSampleSizeType;
  buttons?: any;
}

enum ModalSampleSizeType {
  xl = "xl",
  lg = "lg",
  sm = "sm",
}

class ModalSample extends Component<Readonly<IModalSample>> {
  constructor(props: IModalSample) {
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

  render() {
    return (
      <Modal
        show={this.isShow}
        onHide={() => { this.onHide() }}
        size={this.size}
        className={styles.modal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton className={styles.borderNone}>
          <Modal.Title className={styles.modalTitle}>
            { this.modalTitle }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.children }
        </Modal.Body>
        <Modal.Footer className={styles.borderNone}>
          { this.buttons }
        </Modal.Footer>
      </Modal>
    );
  }
}

export { ModalSample, ModalSampleSizeType };