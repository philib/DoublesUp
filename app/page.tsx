'use client'
import {Input} from "@mui/joy";
import React, {ReactNode, useState} from "react";
import _ from "lodash";
import {
    BottomNavigation,
    BottomNavigationAction,
    Button,
    Checkbox,
    Chip,
    Divider,
    Grid,
    IconButton
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/FavoriteSharp';
import RestoreIcon from '@mui/icons-material/RestoreSharp';

interface LinedUpPlayer {
    lineupPosition: number,
    name: string
}

interface DoublesPairing {
    player1: LinedUpPlayer
    player2: LinedUpPlayer
}

interface Player {
    name: string
}

export default function Home() {
    const allPossibleLineupVariations = [[[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 5], [4, 6]], [[1, 2], [3, 6], [4, 5]], [[1, 2], [4, 5], [3, 6]], [[1, 3], [2, 4], [5, 6]], [[1, 3], [2, 5], [4, 6]], [[1, 3], [2, 6], [4, 5]], [[1, 4], [2, 3], [5, 6]], [[1, 4], [2, 5], [3, 6]], [[1, 4], [2, 6], [3, 5]], [[1, 4], [3, 5], [2, 6]], [[1, 5], [2, 4], [3, 6]], [[1, 5], [3, 4], [2, 6]], [[1, 6], [2, 5], [3, 4]], [[1, 6], [3, 4], [2, 5]], [[2, 3], [1, 4], [5, 6]], [[2, 3], [1, 5], [4, 6]], [[2, 3], [1, 6], [4, 5]], [[2, 4], [1, 5], [3, 6]], [[2, 4], [1, 6], [3, 5]], [[2, 5], [1, 6], [3, 4]], [[3, 4], [1, 6], [2, 5]]]
    const [bottomNavigationValue, setBottomNavigationValue] = useState(0)
    const [showFavorites, setShowFavorites] = useState(false)
    const [inputText, setInputText] = useState("")
    const [players, setPlayers] = useState<Player[]>([
        {name: "Michi R."},
        {name: "Tobi"},
        {name: "Michi F."},
        {name: "Fred"},
        {name: "Franky"},
        {name: "Andi"},
        {name: "Philip"}
    ])
    const [lineup, setLineupIntern] = useState<Record<number, string>>({})
    const setLineup = (l: Record<number, string>) => {
        setLineupIntern(l)
        // setLineupFavorites([])
    }
    const [lineupFavorites, setLineupFavorites] = useState<DoublesPairing[][]>([])
    const ready = Object.values(lineup).length == 6
    const [selectedDoublesPairingFilter, setSelectedDoublesPairingFilter] = useState<DoublesPairing[]>([])
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    const stringify = (lineup: DoublesPairing[]) => JSON.stringify(lineup)
    const isFavorite = (lineup: DoublesPairing[]) => {
        const list = lineupFavorites.map(stringify)
        const element = stringify(lineup);
        return _.includes(list, element)
    }
    const toggleFavorite = (lineup: DoublesPairing[]) => {
        const list = lineupFavorites.map(stringify)
        const element = stringify(lineup)
        if (!_.includes(list, element)) {
            setLineupFavorites([...lineupFavorites, lineup])
        } else {
            setLineupFavorites(lineupFavorites.filter(f => stringify(f) !== element))
        }
    }

    const movePlayerUp = (player: number) => {
        const playerIndex = player - 1
        const nextPlayerIndex = player - 2
        if (playerIndex === 0) {
            return
        }
        const newPlayers = [...players]
        newPlayers[nextPlayerIndex] = players[playerIndex]
        newPlayers[playerIndex] = players[nextPlayerIndex]
        setPlayers(newPlayers)
        setLineup({})
    }
    const movePlayerDown = (player: number) => {
        const playerIndex = player - 1
        const prevPlayerIndex = player
        if (playerIndex === players.length - 1) {
            return
        }
        const newPlayers = [...players]
        newPlayers[prevPlayerIndex] = players[playerIndex]
        newPlayers[playerIndex] = players[prevPlayerIndex]
        setPlayers(newPlayers)
        setLineup({})
    }
    const isEqual = (pair1: DoublesPairing) => {
        return (pair2: DoublesPairing) => pair1.player1.name == pair2.player1.name && pair1.player2.name == pair2.player2.name;
    }
    const isNotEqual = (pair1: DoublesPairing) => {
        return (pair2: DoublesPairing) => pair1.player1.name != pair2.player1.name || pair1.player2.name != pair2.player2.name;
    }
    const toString = (pair: DoublesPairing) => {
        return `${pair.player1.name} - ${pair.player2.name}`
    }

    const renderDoublesPairingText = ({player1, player2}: DoublesPairing) => {
        return `(${player1.lineupPosition} + ${player2.lineupPosition} = ${player1.lineupPosition + player2.lineupPosition}) ${player1.name} + ${player2.name}`
    }

    const allSelectedDoublesPairingFiltersCombinedPredicate: (lineup: DoublesPairing[]) => boolean = selectedDoublesPairingFilter
        .map(doublesPairing => (lineup: DoublesPairing[]) => lineup.find(isEqual(doublesPairing)) != undefined)
        .reduce((acc, curr) => (lineup: DoublesPairing[]) => acc(lineup) && curr(lineup), (lineup: DoublesPairing[]) => true)

    const withFavoriteFilter = (filter: (_: DoublesPairing[]) => boolean) => {
        const isWithinFavorites = (lineup: DoublesPairing[]) => _.includes(lineupFavorites.map(it => JSON.stringify(it)), JSON.stringify(lineup))
        return (lineup: DoublesPairing[]) => showFavoritesOnly ? isWithinFavorites(lineup) && filter(lineup) : filter(lineup)
    }

    let allPossibleLineupVariantions: DoublesPairing[][] = allPossibleLineupVariations.map((variation) => {
        return variation.map((doublesPairing) => {
            const a: DoublesPairing = {
                player1: {
                    lineupPosition: doublesPairing[0],
                    name: Object.values(lineup)[doublesPairing[0] - 1]
                },
                player2: {
                    lineupPosition: doublesPairing[1],
                    name: Object.values(lineup)[doublesPairing[1] - 1]
                }
            }
            return a
        })
    });
    let filteredLineupVariations = allPossibleLineupVariantions.filter(withFavoriteFilter(allSelectedDoublesPairingFiltersCombinedPredicate));

    const allPossibleFilters: DoublesPairing[] = _.uniqBy(allPossibleLineupVariantions.flat(), (it) => JSON.stringify(it))
    const remainingDoublesPairingFilters: Record<string, DoublesPairing> = _.uniqBy(filteredLineupVariations.flat(), (it) => JSON.stringify(it)).reduce((acc, curr) => {
        return {...acc, [JSON.stringify(curr)]: curr}
    }, {})

    const CustomDivider: React.FC<{ children?: ReactNode }> = (props) => (
        <Divider style={{marginTop: '20px', marginBottom: '20px'}}>{props.children}</Divider>)

    return (
        <main style={{display: 'flex', flexDirection: 'column', height: '100%'}}>
            <div style={{flex: 1, overflow: 'auto'}}>
                {bottomNavigationValue === 0 && <>
                    <CustomDivider>Spielereingabe</CustomDivider>
                    <form
                        onSubmit={(event) => {
                            setPlayers([...players, {name: inputText}])
                            event.preventDefault();
                        }}
                        style={{marginBottom: '10px'}}
                    >
                        <Input
                            placeholder="Neue Spieler hinzufügen"
                            required
                            onChange={(t) => setInputText(t.target.value)}
                            sx={{mb: 1, fontSize: 'var(--joy-fontSize-sm)'}}
                        />
                        <Button type="submit" style={{width: '100%'}}><AddIcon/></Button>
                    </form>
                    <CustomDivider>Spielerliste</CustomDivider>
                    <Grid container rowSpacing={3} direction={"column"}>
                        {players.map((entry, index) =>
                            <>
                                <CustomDivider></CustomDivider>
                                <Grid container item key={entry.name} direction={"row"} justifyContent={"flex-start"}
                                      alignItems={"center"} spacing={1}>
                                    <Grid item style={{paddingRight: '10px'}}>
                                        <Checkbox checked={lineup[index + 1] !== undefined} onChange={(e) => {
                                            if (e.target.checked) {
                                                setLineup({...lineup, [index + 1]: entry.name})
                                            } else {
                                                setLineup(_.omit(lineup, [index + 1]))
                                            }
                                        }}/>
                                    </Grid>
                                    <Grid item sx={{flexGrow: 1}}>{entry.name}</Grid>
                                    <Grid item>
                                        <Button
                                            variant="contained"
                                            onClick={() => {
                                                setPlayers(_.without(players, entry))
                                                setLineup(_.omit(lineup, [index + 1]))
                                            }}> <DeleteIcon/> </Button>
                                    </Grid>
                                    <Grid item>
                                        <Grid item container direction={"column"} spacing={2}>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        movePlayerUp(index + 1)
                                                    }}> <KeyboardDoubleArrowUpIcon/> </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => {
                                                        movePlayerDown(index + 1)
                                                    }}> <KeyboardDoubleArrowDownIcon/> </Button>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </>
                }
                {bottomNavigationValue === 1 && ready && <>
                    <>
                        <CustomDivider>Filter</CustomDivider>
                        <Grid container spacing={2} direction={"column"} alignItems={"stretch"}
                              justifyContent={"space-evenly"}>
                            <Grid item xs>
                                <Chip style={{width: '100%'}} key={999}
                                      variant={showFavoritesOnly ? 'filled' : 'outlined'}
                                      color={'primary'}
                                      label={"Nach Favoriten filtern"}
                                      onClick={() => {
                                          setShowFavoritesOnly(!showFavoritesOnly)
                                      }}/>
                            </Grid>
                            {
                                allPossibleFilters.map((doublePairingFilter, index) => {
                                    const active = selectedDoublesPairingFilter.find(isEqual(doublePairingFilter)) != undefined
                                    const disabled = remainingDoublesPairingFilters[JSON.stringify(doublePairingFilter)] === undefined
                                    const style: {
                                        variant: 'filled' | 'outlined',
                                        color: 'default' | 'primary'
                                    } = active ? ({variant: 'filled', color: 'primary'}) : disabled ? ({
                                        variant: 'filled',
                                        color: 'default'
                                    }) : ({variant: 'outlined', color: 'primary'})
                                    // const variant= disabled ? 'outlined' : undefined
                                    return (
                                        <Grid item xs key={`grid-${index}`}>
                                            <Chip style={{width: '100%'}} key={`chip-${index}`} variant={style.variant}
                                                  color={style.color}
                                                  label={renderDoublesPairingText(doublePairingFilter)}
                                                  onClick={() => {
                                                      if (active) {
                                                          setSelectedDoublesPairingFilter(selectedDoublesPairingFilter.filter(isNotEqual(doublePairingFilter)))
                                                      } else if (!disabled) {
                                                          setSelectedDoublesPairingFilter([...selectedDoublesPairingFilter, doublePairingFilter])
                                                      }
                                                  }}/>
                                        </Grid>)
                                })
                            }
                        </Grid>
                    </>
                    <CustomDivider>Doppelvarianten</CustomDivider>
                    <Grid container direction={"column"} rowSpacing={3}
                          alignItems={'center'}>
                        {filteredLineupVariations.map((lineupVariation, index) =>
                            <Grid item container key={index} direction={"column"} rowSpacing={1}>
                                <Grid item>
                                    <CustomDivider>
                                        Variante {index + 1}
                                    </CustomDivider>
                                </Grid>
                                <Grid item>
                                    <Grid item container direction={"row"} spacing={2} alignItems={"center"}>
                                        <Grid item>
                                            {isFavorite(lineupVariation) ?
                                                (<IconButton aria-label="star" onClick={() => {
                                                    toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarIcon color={"primary"}/>
                                                </IconButton>) :
                                                (<IconButton aria-label="unstar" onClick={() => {
                                                    toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarBorderIcon color={"primary"}/>
                                                </IconButton>)
                                            }
                                        </Grid>
                                        <Grid item>
                                            <Grid item container direction={"column"}>
                                                {lineupVariation.map((doublesPairing, index) =>
                                                    <Grid item key={index}>
                                                        {renderDoublesPairingText(doublesPairing)}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </Grid>
                </>
                }
                {
                    bottomNavigationValue === 2 && <>
                        <CustomDivider>Favoriten</CustomDivider>
                        {lineupFavorites.map((lineupVariation, index) =>
                            <Grid item container key={index} direction={"column"} rowSpacing={1}>
                                <Grid item>
                                    <CustomDivider>
                                        Variante {index + 1}
                                    </CustomDivider>
                                </Grid>
                                <Grid item>
                                    <Grid item container direction={"row"} spacing={2} alignItems={"center"}>
                                        <Grid item>
                                            {isFavorite(lineupVariation) ?
                                                (<IconButton aria-label="star" onClick={() => {
                                                    toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarIcon color={"primary"}/>
                                                </IconButton>) :
                                                (<IconButton aria-label="unstar" onClick={() => {
                                                    toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarBorderIcon color={"primary"}/>
                                                </IconButton>)
                                            }
                                        </Grid>
                                        <Grid item>
                                            <Grid item container direction={"column"}>
                                                {lineupVariation.map((doublesPairing, index) =>
                                                    <Grid item key={index}>
                                                        {renderDoublesPairingText(doublesPairing)}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )}
                    </>
                }
            </div>
            <footer>
                <BottomNavigation
                    showLabels
                    value={bottomNavigationValue}
                    onChange={(event, newValue) => {
                        setBottomNavigationValue(newValue)
                    }}
                >
                    <BottomNavigationAction label="Aufstellung" icon={<RestoreIcon/>}/>
                    <BottomNavigationAction label="Varianten" icon={<RestoreIcon/>}/>
                    <BottomNavigationAction label="Favoriten" icon={<FavoriteIcon/>}/>
                </BottomNavigation>
            </footer>
        </main>
    )
}
