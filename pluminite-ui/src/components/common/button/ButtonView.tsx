import styles from './ButtonView.module.css';
import {MouseEvent, Component} from "react";
import {classList} from "../../../utils/sys";

enum buttonColors {
    blue = 'blue',
}

interface IButtonView{
    text: string;
    onClick: (event: MouseEvent) => void;
    color: buttonColors;
}

class ButtonView extends Component<Readonly<IButtonView>>{
    constructor(props: IButtonView) {
        super(props);
    }

    public get text(){
        return this.props.text
    }

    private onClick = async (event: MouseEvent) => {
        this.props.onClick(event);
    }

    public render(){
        return (
            <button
                onClick={this.onClick}
                className={classList(styles.buttonView, styles.blue)}
            >
                {this.text}
            </button>
        )
    }
}

export { ButtonView, buttonColors }