import { ListItem, ListSubheader } from '@mui/material';
import { PlayerId } from '../../RegistrationList';
import { Lineup as LineupFactoryLineup } from '../../LineupFactory';
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
        const favorite: TestVariation = {
          doubles1: {
            player1: v[0][0].value,
            player2: v[0][1].value,
          },
          doubles2: {
            player1: v[1][0].value,
            player2: v[1][1].value,
          },
          doubles3: {
            player1: v[2][0].value,
            player2: v[2][1].value,
          },
        };
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
