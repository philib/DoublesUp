'use client';
import React, { useState } from 'react';
import _ from 'lodash';
import {
  BottomNavigation,
  BottomNavigationAction,
  Chip,
  Grid,
  IconButton,
} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/FavoriteSharp';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import { CustomDivider } from '@/app/customDivider';
import { Lineup, Players } from '@/app/players';
import { Favorites } from '@/app/favorites';
import { Meldeliste, MeldelistePlayer } from './Meldeliste/Meldeliste';

export interface LinedUpPlayer {
  lineupPosition: number;
  name: string;
}

export interface DoublesPairing {
  player1: LinedUpPlayer;
  player2: LinedUpPlayer;
}

export interface Player {
  name: string;
}

function useStateWithLocalStorage<T>(key: string, def: T): [T, (_: T) => void] {
  const [state, setState] = useState(() => {
    try {
      const value = window.localStorage.getItem(key);
      return value ? JSON.parse(value) : def;
    } catch (error) {
      return def;
    }
  });
  const setValue = (value: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      setState(value);
    } catch (error) {
      setState(value);
    }
  };
  return [state, setValue];
}

export default function Home() {
  const allPossibleLineupVariations = [
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    [
      [1, 2],
      [3, 5],
      [4, 6],
    ],
    [
      [1, 2],
      [3, 6],
      [4, 5],
    ],
    [
      [1, 2],
      [4, 5],
      [3, 6],
    ],
    [
      [1, 3],
      [2, 4],
      [5, 6],
    ],
    [
      [1, 3],
      [2, 5],
      [4, 6],
    ],
    [
      [1, 3],
      [2, 6],
      [4, 5],
    ],
    [
      [1, 4],
      [2, 3],
      [5, 6],
    ],
    [
      [1, 4],
      [2, 5],
      [3, 6],
    ],
    [
      [1, 4],
      [2, 6],
      [3, 5],
    ],
    [
      [1, 4],
      [3, 5],
      [2, 6],
    ],
    [
      [1, 5],
      [2, 4],
      [3, 6],
    ],
    [
      [1, 5],
      [3, 4],
      [2, 6],
    ],
    [
      [1, 6],
      [2, 5],
      [3, 4],
    ],
    [
      [1, 6],
      [3, 4],
      [2, 5],
    ],
    [
      [2, 3],
      [1, 4],
      [5, 6],
    ],
    [
      [2, 3],
      [1, 5],
      [4, 6],
    ],
    [
      [2, 3],
      [1, 6],
      [4, 5],
    ],
    [
      [2, 4],
      [1, 5],
      [3, 6],
    ],
    [
      [2, 4],
      [1, 6],
      [3, 5],
    ],
    [
      [2, 5],
      [1, 6],
      [3, 4],
    ],
    [
      [3, 4],
      [1, 6],
      [2, 5],
    ],
  ];
  const [players, setPlayers] = useStateWithLocalStorage<Player[]>(
    'players',
    []
  );
  const [lineupFavorites, setLineupFavorites] = useStateWithLocalStorage<
    DoublesPairing[][]
  >('favorites', []);

  const [bottomNavigationValue, setBottomNavigationValue] = useState(0);
  const [lineup, setLineup] = useState<Lineup | undefined>(undefined);
  const [selectedDoublesPairingFilter, setSelectedDoublesPairingFilter] =
    useState<DoublesPairing[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const stringify = (lineup: DoublesPairing[]) => JSON.stringify(lineup);
  const isFavorite = (lineup: DoublesPairing[]) => {
    const list = lineupFavorites.map(stringify);
    const element = stringify(lineup);
    return _.includes(list, element);
  };
  const toggleFavorite = (lineup: DoublesPairing[]) => {
    const list = lineupFavorites.map(stringify);
    const element = stringify(lineup);
    if (!_.includes(list, element)) {
      setLineupFavorites([...lineupFavorites, lineup]);
    } else {
      setLineupFavorites(
        lineupFavorites.filter((f) => stringify(f) !== element)
      );
    }
  };

  const isEqual = (pair1: DoublesPairing) => {
    return (pair2: DoublesPairing) =>
      pair1.player1.name == pair2.player1.name &&
      pair1.player2.name == pair2.player2.name;
  };
  const isNotEqual = (pair1: DoublesPairing) => {
    return (pair2: DoublesPairing) =>
      pair1.player1.name != pair2.player1.name ||
      pair1.player2.name != pair2.player2.name;
  };

  const renderDoublesPairingText = ({ player1, player2 }: DoublesPairing) => {
    return `(${player1.lineupPosition} + ${player2.lineupPosition} = ${
      player1.lineupPosition + player2.lineupPosition
    }) ${player1.name} + ${player2.name}`;
  };

  const allSelectedDoublesPairingFiltersCombinedPredicate: (
    lineup: DoublesPairing[]
  ) => boolean = selectedDoublesPairingFilter
    .map(
      (doublesPairing) => (lineup: DoublesPairing[]) =>
        lineup.find(isEqual(doublesPairing)) != undefined
    )
    .reduce(
      (acc, curr) => (lineup: DoublesPairing[]) => acc(lineup) && curr(lineup),
      (_: DoublesPairing[]) => true
    );

  const withFavoriteFilter = (filter: (_: DoublesPairing[]) => boolean) => {
    const isWithinFavorites = (lineup: DoublesPairing[]) =>
      _.includes(
        lineupFavorites.map((it) => JSON.stringify(it)),
        JSON.stringify(lineup)
      );
    return (lineup: DoublesPairing[]) =>
      showFavoritesOnly
        ? isWithinFavorites(lineup) && filter(lineup)
        : filter(lineup);
  };

  let allPossibleLineupVariantions: DoublesPairing[][] =
    allPossibleLineupVariations.map((variation) => {
      return variation.flatMap((doublesPairing) => {
        if (lineup) {
          const a: DoublesPairing = {
            player1: {
              lineupPosition: doublesPairing[0],
              name: Object.values(lineup)[doublesPairing[0] - 1].name,
            },
            player2: {
              lineupPosition: doublesPairing[1],
              name: Object.values(lineup)[doublesPairing[1] - 1].name,
            },
          };
          return [a];
        }
        return [];
      });
    });
  let filteredLineupVariations = allPossibleLineupVariantions.filter(
    withFavoriteFilter(allSelectedDoublesPairingFiltersCombinedPredicate)
  );

  const allPossibleFilters: DoublesPairing[] = _.uniqBy(
    allPossibleLineupVariantions.flat(),
    (it) => JSON.stringify(it)
  );
  const remainingDoublesPairingFilters: Record<string, DoublesPairing> =
    _.uniqBy(filteredLineupVariations.flat(), (it) =>
      JSON.stringify(it)
    ).reduce((acc, curr) => {
      return { ...acc, [JSON.stringify(curr)]: curr };
    }, {});

  return (
    <main style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ flex: 1, overflow: 'auto' }}>
        {bottomNavigationValue === 0 && (
          <Meldeliste players={[]} onPlayerListModified={() => {}} />
        )}
        <Players
          players={players}
          onPlayersChange={setPlayers}
          show={bottomNavigationValue === 1}
          onLineupChange={setLineup}
        />
        {bottomNavigationValue === 2 && lineup && (
          <>
            <>
              <CustomDivider>Filter</CustomDivider>
              <Grid
                container
                spacing={2}
                direction={'column'}
                alignItems={'stretch'}
                justifyContent={'space-evenly'}
              >
                <Grid item xs>
                  <Chip
                    style={{ width: '100%' }}
                    key={999}
                    variant={showFavoritesOnly ? 'filled' : 'outlined'}
                    color={'primary'}
                    label={'Nach Favoriten filtern'}
                    onClick={() => {
                      setShowFavoritesOnly(!showFavoritesOnly);
                    }}
                  />
                </Grid>
                {allPossibleFilters.map((doublePairingFilter, index) => {
                  const active =
                    selectedDoublesPairingFilter.find(
                      isEqual(doublePairingFilter)
                    ) != undefined;
                  const disabled =
                    remainingDoublesPairingFilters[
                      JSON.stringify(doublePairingFilter)
                    ] === undefined;
                  const style: {
                    variant: 'filled' | 'outlined';
                    color: 'default' | 'primary';
                  } = active
                    ? { variant: 'filled', color: 'primary' }
                    : disabled
                    ? {
                        variant: 'filled',
                        color: 'default',
                      }
                    : { variant: 'outlined', color: 'primary' };
                  // const variant= disabled ? 'outlined' : undefined
                  return (
                    <Grid item xs key={`grid-${index}`}>
                      <Chip
                        style={{ width: '100%' }}
                        key={`chip-${index}`}
                        variant={style.variant}
                        color={style.color}
                        label={renderDoublesPairingText(doublePairingFilter)}
                        onClick={() => {
                          if (active) {
                            setSelectedDoublesPairingFilter(
                              selectedDoublesPairingFilter.filter(
                                isNotEqual(doublePairingFilter)
                              )
                            );
                          } else if (!disabled) {
                            setSelectedDoublesPairingFilter([
                              ...selectedDoublesPairingFilter,
                              doublePairingFilter,
                            ]);
                          }
                        }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
            <CustomDivider>Doppelvarianten</CustomDivider>
            <Grid
              container
              direction={'column'}
              rowSpacing={3}
              alignItems={'center'}
            >
              {filteredLineupVariations.map((lineupVariation, index) => (
                <Grid
                  item
                  container
                  key={index}
                  direction={'column'}
                  rowSpacing={1}
                >
                  <Grid item>
                    <CustomDivider>Variante {index + 1}</CustomDivider>
                  </Grid>
                  <Grid item>
                    <Grid
                      item
                      container
                      direction={'row'}
                      spacing={2}
                      alignItems={'center'}
                    >
                      <Grid item>
                        {isFavorite(lineupVariation) ? (
                          <IconButton
                            aria-label="star"
                            onClick={() => {
                              toggleFavorite(lineupVariation);
                            }}
                          >
                            <StarIcon color={'primary'} />
                          </IconButton>
                        ) : (
                          <IconButton
                            aria-label="unstar"
                            onClick={() => {
                              toggleFavorite(lineupVariation);
                            }}
                          >
                            <StarBorderIcon color={'primary'} />
                          </IconButton>
                        )}
                      </Grid>
                      <Grid item>
                        <Grid item container direction={'column'}>
                          {lineupVariation.map((doublesPairing, index) => (
                            <Grid item key={index}>
                              {renderDoublesPairingText(doublesPairing)}
                            </Grid>
                          ))}
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </>
        )}
        {bottomNavigationValue === 3 && (
          <Favorites
            allPlayers={players}
            lineupFavorites={lineupFavorites}
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            renderDoublesPairingText={renderDoublesPairingText}
          />
        )}
      </div>
      <footer>
        <BottomNavigation
          showLabels
          value={bottomNavigationValue}
          onChange={(event, newValue) => {
            setBottomNavigationValue(newValue);
          }}
        >
          <BottomNavigationAction
            label="Meldeliste"
            icon={<AccountCircleIcon />}
          />
          <BottomNavigationAction
            label="Aufstellung"
            icon={<AccountCircleIcon />}
          />
          {lineup && (
            <BottomNavigationAction
              label="Doppelvarianten"
              icon={<SportsTennisIcon />}
            />
          )}
          <BottomNavigationAction label="Favoriten" icon={<FavoriteIcon />} />
        </BottomNavigation>
      </footer>
    </main>
  );
}
