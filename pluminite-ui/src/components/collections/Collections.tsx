import React, { Component } from 'react';
import { IBaseComponentProps, withComponent } from '../../utils/withComponent';
import CreateCollection from './createCollection/CreateCollection';
import CollectionList from './collectionList/CollectionList';
import CollectionDetail from './collectionDetail/CollectionDetail';

export enum RenderType {
  collectionList = 'collectionList',
  collectionDetail = 'collectionDetail',
  createCollection = 'createCollection'
}

class Collections extends Component<IBaseComponentProps> {
  public state = {
    renderType: RenderType.collectionList
  }

  constructor(props) {
    super(props);
  }

  private changeRenderType(type: RenderType) {
    this.setState({
      ...this.state,
      renderType: type
    })
  }

  private renderByType() {
    switch (this.state.renderType) {
      case RenderType.collectionList:
        return (
          <CollectionList
            changeRenderType={(type: RenderType) => this.changeRenderType(type)}
          />
        )
      case RenderType.createCollection:
        return (
          <CreateCollection
            changeRenderType={(type: RenderType) => this.changeRenderType(type)}
          />
        )
      case RenderType.collectionDetail:
        return (
          <CollectionDetail
            changeRenderType={(type: RenderType) => this.changeRenderType(type)}
          />
        )
    }
  }

  public render() {
    return (
      <div className={`container`}>
        {this.renderByType()}
      </div>
    )
  }
}

export default withComponent(Collections);
