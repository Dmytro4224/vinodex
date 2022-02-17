import {Component} from "react";
import {Modal} from "react-bootstrap";

interface IModalSample {
  modalTitle: string
  children: any;
  buttons: any;
  size?: string;
  isShow: boolean;
  onHide: () => void;
}

enum ModalSampleSizeType {
  lg = "lg",
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
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            { this.modalTitle }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { this.children }
        </Modal.Body>
        <Modal.Footer>
          { this.buttons }
        </Modal.Footer>
      </Modal>
    );
  }
}

export { ModalSample, ModalSampleSizeType };