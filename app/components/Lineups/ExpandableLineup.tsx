import { CardContent, CardHeader } from '@mui/material';
import { CustomDivider } from './customDivider';
import { useState } from 'react';
import { PlayerId } from '../../RegistrationList';
import { Lineup as LineupFactoryLineup } from '../../LineupFactory';
import { Variation as TestVariation } from '../../service/RegistrationListService';
import { LineupCard } from './LineupCard';
import { VariationComponent } from './VariationComponent';

export const ExpandableLineup: React.FC<{
  lineupVariation: number;
  lineup: LineupFactoryLineup;
  getPlayerNameById: (id: PlayerId) => string;
  favorize: (f: TestVariation) => void;
  unfavorize: (f: TestVariation) => void;
  isFavorite: (f: TestVariation) => boolean;
}> = ({
  lineupVariation,
  lineup: { activePlayers, inactivePlayers, variations },
  getPlayerNameById,
  favorize,
  unfavorize,
  isFavorite,
}) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <>
      <LineupCard>
        <CardContent>
          <CardHeader
            onClick={() => setExpanded(!expanded)}
            title={'Lineup #' + lineupVariation}
            subheader={
              <>
                <div>
                  With:
                  {activePlayers.map((p) => getPlayerNameById(p)).join(' ,')}
                </div>
                <div>
                  Without:
                  {inactivePlayers.map((p) => getPlayerNameById(p)).join(' ,')}
                </div>
              </>
            }
          />
          {expanded &&
            variations.map((v, index) => {
              const favorite: TestVariation = {
                doubles1: {
                  player1: v[0][0].id,
                  player2: v[0][1].id,
                },
                doubles2: {
                  player1: v[1][0].id,
                  player2: v[1][1].id,
                },
                doubles3: {
                  player1: v[2][0].id,
                  player2: v[2][1].id,
                },
              };
              return (
                <div key={`variant ${index}`}>
                  <CustomDivider>Variant {index + 1}</CustomDivider>
                  <VariationComponent
                    variation={v}
                    getPlayerNameById={getPlayerNameById}
                    favorize={() => favorize(favorite)}
                    unfavorize={() => unfavorize(favorite)}
                    isFavorite={isFavorite(favorite)}
                  />
                </div>
              );
            })}
        </CardContent>
      </LineupCard>
    </>
  );
};
