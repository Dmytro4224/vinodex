import React from 'react';
import { Component } from 'react';
import styles from './likeView.module.css';
import userIcon from '../../assets/icons/user-icon.svg';
import likeIcon from '../../assets/icons/favorite-icon.svg';
import likeIconFill from '../../assets/icons/favorite-icon-fill.svg';

interface ILikeView{
    isChanged: boolean;
    isActive: boolean;
    customClass?: string,
    type: LikeViewType;
    count: number;
}

enum LikeViewType {
    like = 'like',
    user = 'user'
}

class LikeView extends Component<Readonly<ILikeView>>{
    private _refImg: React.RefObject<HTMLImageElement>;
    private _refCount: React.RefObject<HTMLSpanElement>;
    private _count: number;
    private _isChanged: boolean;

    constructor(props: ILikeView) {
        super(props);

        this._isChanged = this.props.isChanged || false;
        this._count = this.props.count || 0;
        this._refImg = React.createRef();
        this._refCount = React.createRef();
    }

    render(){
        return (
            <div className={`${styles.iconStyle} ${this.props.customClass || ''}` }>
                { this.props.type === 'like' ? this.renderLikeType() : this.renderUserType() }
            </div>
        )
    }

    public set count(value: number){
        this._count = value;

        if(this._refCount.current == null){ return }

        this._refCount.current.innerHTML = this._count.toString();
    }

    private changedIcon = async () => {
        this._isChanged = !this._isChanged;

        if(this._refImg.current == null) { return }

        if(this._isChanged){
            let c = this._count + 1;
            this.count = c;

            this._refImg.current.src = likeIconFill;
        }else{
            let c = this._count > 0 ? this._count - 1 : 0;
            this.count = c;

            this._refImg.current.src = likeIcon;
        }
    }

    private renderLikeType(){
        return (
            <>
                <img ref={this._refImg} onClick={() => { this.changedIcon(); }} className={styles.likeImage} src={this._isChanged ? likeIconFill : likeIcon} alt={''} />
                <span ref={this._refCount} className={styles.count}>{this.props.count}</span>
            </>
        )
    }

    private renderUserType(){
        return (
            <>
                <img ref={this._refImg} src={userIcon} alt={''}/>
                <span ref={this._refCount} className={styles.count}>{this.props.count}</span>
            </>
        )
    }
}

export { LikeView, LikeViewType }