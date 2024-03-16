import {Card, CardContent, Divider, ListItem, ListItemButton, ListItemText, Typography,} from '@mui/material';
import {PlayerId} from '../../logic/RegistrationList';
import {Lineup as LineupFactoryLineup} from '../../logic/Lineup';
import {Variation as TestVariation} from '../../service/RegistrationListService';
import {VariationComponent} from './VariationComponent';
import {useFormatMessage} from '../../MyIntlProvider';
import {MyListItem, MyListItemButton, MyListSubHeader} from "../List/ListComponent";

export const LineupComponent: React.FC<{
    lineup: LineupFactoryLineup<PlayerId>;
    getPlayerNameById: (id: PlayerId) => string;
    favorize: (f: TestVariation) => void;
    unfavorize: (f: TestVariation) => void;
    isFavorite: (f: TestVariation) => boolean;
}> = ({
          lineup: {inactivePlayers, variations},
          getPlayerNameById,
          favorize,
          unfavorize,
          isFavorite,
      }) => {
    const formatMessage = useFormatMessage();
    return (
        <>
            <MyListSubHeader
            >
                <ListItemButton>
                    <ListItemText>
                        <Typography>
                            {inactivePlayers.length > 0 ?
                                `${formatMessage('lineup.without')}: ${inactivePlayers.map((p) => getPlayerNameById(p)).join(', ')}` : formatMessage('lineup.single')}
                        </Typography>
                    </ListItemText>
                </ListItemButton>
            </MyListSubHeader>
            {variations.map((v, index) => {
                const favorite = v.flatMap((pairing) => [
                    {player1: pairing[0].value, player2: pairing[1].value},
                ]);
                return (
                    <>
                        <MyListItem key={`variant ${index}`}>
                            <div style={{paddingTop: '5px', paddingBottom: '5px', width: '100%'}}>
                                <VariationComponent
                                    variation={v}
                                    getPlayerNameById={getPlayerNameById}
                                    favorize={() => favorize(favorite)}
                                    unfavorize={() => unfavorize(favorite)}
                                    isFavorite={isFavorite(favorite)}
                                />
                            </div>
                        </MyListItem>
                        <Divider/>
                    </>
                );
            })}
        </>
    );
};
