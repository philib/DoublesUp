import {
    Checkbox,
    Collapse,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {MyList, MyListSubHeader} from "../List/ListComponent";
import styles from '../../app.module.css';
import {useState} from "react";
import {Meldeliste} from "../Meldeliste/Meldeliste";

export interface Mannschaft {
    name: string;
    anzahlSpieler: 4 | 6;
}

export interface NormalMannschaft extends Mannschaft {
    meldeliste: { [_: number]: string }
}

export interface MixedMannschaft extends Mannschaft {
    meldeliste: {
        maenner: { [_: number]: string },
        frauen: { [_: number]: string }
    }
}

export interface MannschaftenProps {
    mannschaften: (NormalMannschaft | MixedMannschaft)[];
}

export const Mannschaften: React.FC<MannschaftenProps> = (props) => {
    const [validMannschaften, setValidMannschaften] = useState(props.mannschaften.map((_, index) => false));
    const updateValidMannschaft = (index: number, valid: boolean) => {
        if (validMannschaften[index] !== valid) {
            setValidMannschaften(validMannschaften.map((_, i) => i === index ? valid : validMannschaften[i]))
        }
    }

    const [openedTeam, setOpenedTeam] = useState<number | null>(
        null
    );

    return (<MyList
        className={`${styles.fadingOverflow}`}
        sx={{
            paddingTop: 0,
            width: '100%',
            height: '100%',
            bgcolor: 'background.paper',
            overflow: 'auto',
        }}
    >
        {props.mannschaften.map((m, index) => (
            <>
                <MyListSubHeader>
                    <div
                        style={{marginBottom: openedTeam === index ? undefined : '10px'}}>
                        <ListItemButton
                            onClick={() => {
                                setOpenedTeam(openedTeam === index ? null : index);
                            }}
                        >
                            <ListItemText primary={m.name}/>
                            {openedTeam === index ? <ExpandLess/> : <ExpandMore/>}
                        </ListItemButton>
                    </div>
                </MyListSubHeader>
                <Collapse in={openedTeam === index} timeout="auto" unmountOnExit>
                         <Meldeliste meldeliste={m.meldeliste} size={m.anzahlSpieler} onValid={(a) => {
                             updateValidMannschaft(index, true)
                         }} onInvalid={() => {
                             updateValidMannschaft(index, false)
                         }}/>
                </Collapse>
            </>
        ))}
    </MyList>)
}