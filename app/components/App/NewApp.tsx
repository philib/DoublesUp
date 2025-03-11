import {erstelleMannschaft, UIMannschaft} from "../UIMannschaft";
import {Mannschaften, MannschaftenComponent} from "../Mannschaften/Mannschaften";
import {Navigator} from "../Navigator/Navigator";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import {useState} from "react";

export const NewApp: React.FunctionComponent<{}> = () => {
    const mannschaft = erstelleMannschaft('Herren 30', {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"}, 4);
    const mannschaft2 = erstelleMannschaft('Herren 40', {1: "Peter", 2: "Hans", 3: "Otto", 4: "Friedrich"}, 4);
    const [mannschaften, setMannschaften] = useState([mannschaft, mannschaft2]);
    const [currentMannschaft, setCurrentMannschaft] = useState<number | null>(null);
    const getCurrentMannschaft = () => {
        if (currentMannschaft === null) {
            return undefined;
        }
        return mannschaften[currentMannschaft];
    }
    const mannschaftenComponent = <MannschaftenComponent mannschaften={mannschaften}
                                                         currentMannschaft={setCurrentMannschaft}
                                                         onUpdate={setMannschaften}/>;

    console.log(getCurrentMannschaft()?.name)
    return <Navigator navigations={[{
        disabledHint: undefined,
        title: 'Mannschaften',
        icon: <AccountCircleIcon fontSize="large"/>,
        component: mannschaftenComponent
    }, {
        disabledHint: getCurrentMannschaft()?.isValideAufstellung === false ? 'Not enough players' : undefined,
        title: 'Lineups',
        icon: <AccountCircleIcon fontSize="large"/>,
        component: <div>Disabled {getCurrentMannschaft()?.name}</div>
    }]}/>;
}