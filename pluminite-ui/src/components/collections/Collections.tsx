import React, { Component } from 'react';
import { IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import CreateCollection from './createCollection/CreateCollection';
import CollectionList from './collectionList/CollectionList';
import CollectionDetail from './collectionDetail/CollectionDetail';
import { ICollectionResponseItem } from '../../types/ICollectionResponseItem';

export enum RenderType {
  collectionList = 'collectionList',
  collectionDetail = 'collectionDetail',
  createCollection = 'createCollection'
}

interface ICollections extends IProps {
  collectionOwner?: string | null;
}

class Collections extends Component<ICollections & IBaseComponentProps> {
  public state = {
    renderType: RenderType.collectionList,
    collectionData: null
  }

  constructor(props: ICollections & IBaseComponentProps) {
    super(props);
  }

  private changeRenderType(type: RenderType, collectionData?: ICollectionResponseItem | null) {
    this.setState({
      ...this.state,
      renderType: type,
      collectionData: collectionData
    })
  }

  private renderByType() {
    switch (this.state.renderType) {
      case RenderType.collectionList:
        return (
          <CollectionList
            collectionOwner={this.props.collectionOwner}
            changeRenderType={(type: RenderType, data?: ICollectionResponseItem | null) => this.changeRenderType(type, data)}
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
            collectionData={this.state.collectionData}
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
