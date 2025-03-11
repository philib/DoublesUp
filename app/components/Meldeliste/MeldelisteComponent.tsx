import {MyList, MyListItem} from "../../components/List/ListComponent";
import {Checkbox, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";

type Rang = number;

export interface MeldelisteProps {
    meldeListe: Rang[];
    spielerAufstellen: (rang: Rang) => void;
    spielerVonAufstellungEntfernen: (rang: Rang) => void;
    istAufgestellt: (rang: Rang) => boolean;
    name: (rang: Rang) => string;
}

export const MeldelisteComponent: React.FunctionComponent<MeldelisteProps> = ({
                                                                         meldeListe,
                                                                         spielerAufstellen,
                                                                         spielerVonAufstellungEntfernen,
                                                                         istAufgestellt,
                                                                         name,
                                                                     }) => {
    const spielerSelektieren = (rang: Rang) => {
        if (!istAufgestellt(rang)) {
            spielerAufstellen(rang);
        } else {
            spielerVonAufstellungEntfernen(rang)
        }
    }
    const spieler = meldeListe.map((rang) => Spieler(rang, name(rang), istAufgestellt(rang), spielerSelektieren));
    return (<MyList>
        {spieler}
    </MyList>);
};

const Spieler = (rang: Rang, name: string, selected: boolean, onClick: (rang: Rang) => void) => {
    return (<MyListItem key={rang}>
        <ListItemButton
            role={undefined}
            onClick={() => onClick(rang)}
            dense
        >
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={selected}
                    tabIndex={-1}
                    disableRipple
                />
            </ListItemIcon>
            <ListItemText id={`${rang}`} primary={name}/>`
        </ListItemButton>
    </MyListItem>)
        ;
}