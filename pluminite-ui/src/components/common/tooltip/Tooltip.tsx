import {Component} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";

interface ITooltip {
  placement: PlacementType;
  children: any;
  text: string;
}

enum PlacementType {
  top = "top",
  left = "left",
  right = "right",
  bottom = "bottom"
}

class TooltipS extends Component<Readonly<ITooltip>> {
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
        overlay={
          <Tooltip id={`tooltip-${this.placement}`}>
            {this.text}
          </Tooltip>
        }
        children={this.children}
      />
    )
  }
}

export { TooltipS, PlacementType }