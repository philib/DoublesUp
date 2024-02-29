import React, { useEffect } from 'react';
import { LineupsComponent } from '../Lineups/Lineups';
import { useService } from '../ServiceProvider/useRegistrationListServiceFactory';

export const LineupsComponentWithState: React.FunctionComponent<{}> = () => {
  const service = useService();
  const [lineups, setLineups] = React.useState(service.lineups);
  useEffect(() => {
    setLineups(service.lineups);
  }, [service.lineups]);
  return (
    <LineupsComponent
      lineups={lineups.map((lineup) => ({
        activePlayers: lineup.activePlayers.map((player) => ({
          id: player,
          name: service.getPlayerById(player)?.name ?? '',
        })),
        inactivePlayers: lineup.inactivePlayers.map((player) => ({
          id: player,
          name: service.getPlayerById(player)?.name ?? '',
        })),
        variations: lineup.variations.map((doublePairings) => {
          return doublePairings.map(([firstPlayer, secondPlayer]) => {
            return [
              {
                ...firstPlayer,
                name: service.getPlayerById(firstPlayer.id)?.name ?? '',
              },
              {
                ...secondPlayer,
                name: service.getPlayerById(secondPlayer.id)?.name ?? '',
              },
            ];
          });
        }),
      }))}
      getPlayerNameById={(id) => {
        return service.getPlayerById(id)?.name ?? '';
      }}
    />
  );
};
