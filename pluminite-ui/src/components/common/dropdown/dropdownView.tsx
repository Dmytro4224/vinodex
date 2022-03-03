import React, {MouseEvent, Component} from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import styles from './dropdownView.module.css';

interface IDropdownView {
    colorType: dropdownColors,
    onChange: (item: dropdownItem) => void;
    childrens: dropdownItem[],
    disabled?: boolean,
    title: string
}

interface dropdownItem {
    id: number,
    title: string
}

enum dropdownColors {
    blue = 'blue',
    white = 'white',
    gray = 'gray',
    whiteGray = 'whiteGray',
    select = 'select',
    primary = 'primary',
    selectGray = 'selectGray',
    darkGray = 'darkGray',
}

class DropdownView extends Component<Readonly<IDropdownView>>{
    constructor(props: IDropdownView) {
        super(props);
    }

    private get childrens(){
        return this.props.childrens;
    }

    public get dropdownColor(){
        let color = 'blue';

        switch (this.props.colorType){
            case 'blue':
                color = styles.dropdownBlue;
                break;
            case 'white':
                color = styles.dropdownWhite;
                break;
            case 'select':
                color = styles.dropdownSelect;
                break;
            case 'primary':
                color = styles.dropdownPrimary;
                break;
            case 'gray':
                color = styles.dropdownGray;
                break;
            case 'whiteGray':
                color = styles.dropdownWhiteGray;
                break;
            case 'selectGray':
                color = styles.dropdownSelectGray;
                break;
            case 'darkGray':
                color = styles.dropdownDarkGray;
                break;
        }

        return color;
    }

    private onChange(item: dropdownItem){
        this.props.onChange(item)
    }

    render(){
        return(
            <>
                <Dropdown  className={`${styles.customDropdown}`}>
                    <Dropdown.Toggle disabled={this.props.disabled || false} variant="" id="dropdown-basic" className={`${styles.dropdownButton} ${this.dropdownColor}`}>
                        {this.props.title}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {this.childrens.map((child, i) => {
                            return <Dropdown.Item key={i} onClick={() => { this.onChange(child) }} className={styles.dropdownItem}>{child.title}</Dropdown.Item>
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}

export { DropdownView, dropdownColors }