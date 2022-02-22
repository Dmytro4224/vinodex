import {Component} from "react";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {IBaseComponentProps, IProps, withComponent } from "../../../utils/withComponent";

interface ITooltip extends IProps{
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

class TooltipS extends Component<ITooltip & IBaseComponentProps> {
  constructor(props: ITooltip & IBaseComponentProps) {
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
export default withComponent(TooltipS);
export { PlacementType }