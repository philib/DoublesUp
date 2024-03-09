import { ListItem, ListSubheader } from '@mui/material';
import { PlayerId } from '../../logic/RegistrationList';
import { Lineup as LineupFactoryLineup } from '@/app/logic/Lineup';
import { Variation as TestVariation } from '../../service/RegistrationListService';
import { VariationComponent } from './VariationComponent';
import { useFormatMessage } from '../../MyIntlProvider';

export const ExpandableLineup: React.FC<{
  lineup: LineupFactoryLineup<PlayerId>;
  getPlayerNameById: (id: PlayerId) => string;
  favorize: (f: TestVariation) => void;
  unfavorize: (f: TestVariation) => void;
  isFavorite: (f: TestVariation) => boolean;
}> = ({
  lineup: { inactivePlayers, variations },
  getPlayerNameById,
  favorize,
  unfavorize,
  isFavorite,
}) => {
  const formatMessage = useFormatMessage();
  return (
    <>
      {inactivePlayers.length > 0 && (
        <ListSubheader>
          {formatMessage('lineup.without')}:{' '}
          {inactivePlayers.map((p) => getPlayerNameById(p)).join(', ')}
        </ListSubheader>
      )}
      {variations.map((v, index) => {
        const favorite = v.flatMap((pairing) => [
          { player1: pairing[0].value, player2: pairing[1].value },
        ]);
        return (
          <ListItem key={`variant ${index}`}>
            <VariationComponent
              variation={v}
              getPlayerNameById={getPlayerNameById}
              favorize={() => favorize(favorite)}
              unfavorize={() => unfavorize(favorite)}
              isFavorite={isFavorite(favorite)}
            />
          </ListItem>
        );
      })}
    </>
  );
};
