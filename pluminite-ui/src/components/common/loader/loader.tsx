import { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../../utils/withComponent';
import { Spinner } from 'react-bootstrap';

interface ILoader extends IProps {
}

class Loader extends Component<ILoader & IBaseComponentProps> {
  constructor(props: ILoader & IBaseComponentProps) {
    super(props);
  }

  render() {
    return (
      <div className='w-100 text-center'>
        <Spinner animation='border' variant='warning' />
      </div>
    );
  }

}

export default withComponent(Loader);
