import { Component } from 'react';
import styles from './tokenCardView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import ButtonView, {buttonColors} from '../common/button/ButtonView';
import LikeView, { LikeViewType } from '../like/likeView';
import { NavLink } from 'react-router-dom';
import {IBaseComponentProps, IProps, withComponent } from '../../utils/withComponent';
import {showToast} from "../../utils/sys";
import {EShowTost} from "../../types/ISysTypes";

interface ITokenCardView extends IProps{
    icon?: any;
    alt?: string;
    countL: number;
    countR: number;
    days: string;
    name: string;
    author: string;
    likesCount: number;
    buttonText: string;
    isSmall?: boolean;
    linkTo?: string;
    tokenID: string;
    isLike: boolean;
    onClick?: () => void
}
type stateTypes = {
    isLike: boolean;
    likesCount: number;
};
class TokenCardView extends Component<Readonly<ITokenCardView & IBaseComponentProps>>{
   public state: stateTypes = {
        isLike: this.props.isLike,
        likesCount: this.props.likesCount
    }
    private readonly isSmall: boolean
    private  _isProcessLike: boolean
    constructor(props: ITokenCardView & IBaseComponentProps) {
        super(props);
        console.log('TokenCardView props',props)
        this.isSmall = this.props?.isSmall || false;
        this._isProcessLike = false
    }

    private get icon(){
        return this.props.icon || cardPreview
    }
    private get tokenID(){
        return this.props.tokenID
    }
    private onClick(){
        this.props.onClick && this.props.onClick();
    }
    public changeLikeCount(count: number,isLike: boolean){
        this.setState({
            ...this.state,
            isLike: isLike,
            likesCount: count
        })
    }
    private  toggleLikeToken = async () => {
        try {
            if (this._isProcessLike){
                return
            }
            this._isProcessLike = true;
             this.changeLikeCount(!this.state.isLike ? this.state.likesCount + 1 : this.state.likesCount - 1,!this.state.isLike);
            await this.props.nftContractContext.token_set_like(this.tokenID);
            this._isProcessLike = false;
            console.log('this.tate',this.state)
        } catch(ex) {
            this._isProcessLike = false;
           this.changeLikeCount( this.state.likesCount,this.state.isLike);
            showToast({
                message: `Error! Please try again later`,
                type: EShowTost.error
            });
        }
    }
    render(){
        return(
            <div className={`${styles.card} ${this.isSmall ? styles.cardSmall : ''}`}>
                <div className={styles.cardImage}>
                    <img className={styles.imageStyle} src={this.icon} alt={this.props.alt || 'preview image'}/>
                    <div className={styles.cardDetail}>
                        { (this.props.countL > 0 || this.props.countR > 0) && <div className={styles.count}>
                            {this.props.countL}/{this.props.countR}
                        </div> }
                        { this.props.days !== '' || this.props.days !== null && <div className={styles.daysInfo}>
                            {this.props.days}
                        </div> }
                    </div>
                </div>
                <div className={styles.cardFooter}>
                    <div className={styles.cardInfo}>
                        {this.props.linkTo ? <NavLink to={this.props.linkTo}><div className={styles.infoName}>{this.props.name}</div></NavLink> : <div className={styles.infoName}>{this.props.name}</div> }
                        <div className={styles.authorName}>{this.props.author}</div>
                    </div>
                    <div className={styles.cardControls}>
                        <LikeView
                          customClass={styles.likes}
                          isChanged={this.state.isLike}
                          isActive={true}
                          type={LikeViewType.like}
                          count={this.state.likesCount}
                          onClick={this.toggleLikeToken}
                        />
                        <ButtonView
                            text={this.props.buttonText}
                            onClick={() => { this.onClick() }}
                            color={buttonColors.goldFill}
                            customClass={styles.button}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export default withComponent(TokenCardView);
export type { ITokenCardView };
