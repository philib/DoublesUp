import {
    Collapse,
    ListItemButton,
    ListItemText,
} from '@mui/material';

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {MyList, MyListSubHeader} from "../List/ListComponent";
import styles from '../../app.module.css';
import {useEffect, useState} from "react";
import {UIMannschaft} from "../UIMannschaft";
import {MeldelisteComponent} from "../Meldeliste/MeldelisteComponent";

export interface MannschaftenProps {
    mannschaften: UIMannschaft[];
}

export const Mannschaften: React.FC<MannschaftenProps> = (props) => {
    const [mannschaften, setMannschaften] = useState(props.mannschaften);
    return <MannschaftenComponent mannschaften={mannschaften} onUpdate={setMannschaften} currentMannschaft={(m) => {
        alert(mannschaften[m].name);
    }}/>
}

export interface MannschaftenComponentProps {
    mannschaften: UIMannschaft[];
    onUpdate: (mannschaften: UIMannschaft[]) => void;
    currentMannschaft: (_: number) => void;
}

export const MannschaftenComponent: React.FC<MannschaftenComponentProps> = (props) => {
    const [openedTeam, setOpenedTeam] = useState<number | null>(
        null
    );
    useEffect(() => {
        if(openedTeam !== null) props.currentMannschaft(openedTeam);
    }, [openedTeam]);
    const updateMannschaft = (index: number) => (f: (_: number) => UIMannschaft) => (spieler: number) => {
        props.onUpdate(props.mannschaften.map((m, i) => i === index ? f(spieler) : m));
    }

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
                    <MeldelisteComponent
                        name={m.getSpielerNameByRank}
                        meldeListe={m.gemeldeteSpieler}
                        spielerVonAufstellungEntfernen={updateMannschaft(index)(m.entfernen)}
                        spielerAufstellen={updateMannschaft(index)(m.aufstellen)}
                        istAufgestellt={m.isSpielerAufgestellt}

                    />
                </Collapse>
            </>
        ))}
    </MyList>)
}