import styles from './ButtonView.module.css';
import React, {MouseEvent, Component} from "react";
import {classList} from "../../../utils/sys";

enum buttonColors {
    blue = 'blue',
    white = 'white',
    gray = 'gray',
    whiteGray = 'whiteGray',
    select = 'select',
    primary = 'primary',
    selectGray = 'selectGray',
    darkGray = 'darkGray',
}

interface IButtonView{
    text: string;
    onClick: (event: MouseEvent) => void;
    color: buttonColors;
    icon?: any;
}

class ButtonView extends Component<Readonly<IButtonView>>{
    private readonly _ref:  React.RefObject<HTMLButtonElement>;

    constructor(props: IButtonView) {
        super(props);

        this._ref = React.createRef();
    }

    public get text(){
        return this.props.text
    }

    public get buttonColor(){
        let color = 'blue';

        switch (this.props.color){
            case 'blue':
                color = styles.btnBlue;
                break;
            case 'white':
                color = styles.btnWhite;
                break;
            case 'select':
                color = styles.btnSelect;
                break;
            case 'primary':
                color = styles.btnPrimary;
                break;
            case 'gray':
                color = styles.btnGray;
                break;
            case 'whiteGray':
                color = styles.btnWhiteGray;
                break;
            case 'selectGray':
                color = styles.btnSelectGray;
                break;
            case 'darkGray':
                color = styles.btnDarkGray;
                break;
        }

        return color;
    }

    private onClick = async (event: MouseEvent) => {
        this.props.onClick(event);
    }

    public render(){
        return (
            <button
                ref={this._ref}
                onClick={this.onClick}
                className={`${styles.buttonView} ${this.buttonColor} ${this.props.icon && styles.btnIcon}`}>
                <span className={styles.btnText}>{this.text}</span>
                {this.props.icon && <i style={{
                    backgroundImage: `url(${this.props.icon})`
                }} className={`${styles.icon}`}></i>}
            </button>
        )
    }
}

export { ButtonView, buttonColors }