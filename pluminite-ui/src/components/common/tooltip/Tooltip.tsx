import {Component} from "react";
import {OverlayTrigger} from "react-bootstrap";

interface ITooltip {
  placement: PlacementType;
  text: string;
}

enum PlacementType {
  top = "top",
  left = "left",
  right = "right",
  bottom = "bottom"
}

class Tooltip extends Component<Readonly<ITooltip>> {
  constructor(props: ITooltip) {
    super(props);
  }

  private get placement() {
    return this.props.placement;
  }

  private get text() {
    return this.props.text;
  }

  private get children() {
    return this.props.children;
  }

  render() {
    return (
      <OverlayTrigger
        placement={this.placement}
        overlay={ <Tooltip id={`tooltip-top`} placement={this.placement} text={this.text} /> }
        children={this.children}
      />
    )
  }
}

export { Tooltip, PlacementType }