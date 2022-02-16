import styles from './dropdownView.module.css';
import React, {MouseEvent, Component} from "react";
import Dropdown from 'react-bootstrap/Dropdown';

interface IDropdownView{
    colorType: dropdownColors
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

    render(){
        return(
            <>
                <Dropdown className={`${styles.customDropdown}`}>
                    <Dropdown.Toggle variant="primary" id="dropdown-basic" className={styles.dropdownButton}>
                        Sort by
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                        <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                        <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        )
    }
}

export { DropdownView, dropdownColors }