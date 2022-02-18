import { Component } from 'react';
import styles from './tokenCardView.module.css';
import cardPreview from '../../assets/icons/card-preview.jpg';
import {buttonColors, ButtonView } from '../common/button/ButtonView';
import { LikeView, LikeViewType } from '../like/likeView';
import { NavLink } from 'react-router-dom';

interface ITokenCardView{
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
    onClick: () => void
}

class TokenCardView extends Component<Readonly<ITokenCardView>>{
    private readonly isSmall: boolean
    constructor(props: ITokenCardView) {
        super(props);

        this.isSmall = this.props?.isSmall || false;
    }

    private get icon(){
        return this.props.icon || cardPreview
    }

    private onClick(){
        this.props.onClick();
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
                        { this.props.days !== '' && <div className={styles.daysInfo}>
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
                          isChanged={false}
                          isActive={true}
                          type={LikeViewType.like}
                          count={22}
                        />
                        <ButtonView
                            text={this.props.buttonText}
                            onClick={() => { this.onClick() }}
                            color={buttonColors.blue}
                            customClass={styles.button}
                        />
                    </div>
                </div>
            </div>
        )
    }
}

export {TokenCardView};
export type { ITokenCardView };
