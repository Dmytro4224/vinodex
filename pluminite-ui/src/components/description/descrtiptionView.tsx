import { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';

interface IDescriptionView extends IProps {
  text: string;
}

class DescrtiptionView extends Component<IDescriptionView & IBaseComponentProps> {
  constructor(props: IDescriptionView & IBaseComponentProps) {
    super(props);
  }

  private get text() {
    return this.props.text;
  }

  render() {
    return (
      <p style={{
        fontWeight: '400',
        fontSize: '14px',
        lineHeight: '22px',
        color: 'var(--topaz)',
      }}
      >
        {this.text}
      </p>
    );
  }
}

export default withComponent(DescrtiptionView);
