import styles from './Button.module.css';
import {Component} from "react";

interface IButtonView{
    text: string;
    onClick: () => void;
}

class ButtonView extends Component<>{
    constructor() {
        super();
    }

    render(){
        return <button></button>;
    }
}

export { ButtonView };