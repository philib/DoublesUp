'use client'
import {Input} from "@mui/joy";
import React, {ReactNode, useState} from "react";
import _ from "lodash";
import {Button, Checkbox, Chip, Divider, Grid, IconButton} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';

export default function Home() {
    const allPossibleLineupVariations = [[[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 5], [4, 6]], [[1, 2], [3, 6], [4, 5]], [[1, 2], [4, 5], [3, 6]], [[1, 3], [2, 4], [5, 6]], [[1, 3], [2, 5], [4, 6]], [[1, 3], [2, 6], [4, 5]], [[1, 4], [2, 3], [5, 6]], [[1, 4], [2, 5], [3, 6]], [[1, 4], [2, 6], [3, 5]], [[1, 4], [3, 5], [2, 6]], [[1, 5], [2, 4], [3, 6]], [[1, 5], [3, 4], [2, 6]], [[1, 6], [2, 5], [3, 4]], [[1, 6], [3, 4], [2, 5]], [[2, 3], [1, 4], [5, 6]], [[2, 3], [1, 5], [4, 6]], [[2, 3], [1, 6], [4, 5]], [[2, 4], [1, 5], [3, 6]], [[2, 4], [1, 6], [3, 5]], [[2, 5], [1, 6], [3, 4]], [[3, 4], [1, 6], [2, 5]]]
    const [inputText, setInputText] = useState("")
    const [players, setPlayers] = useState<string[]>([
        "Michi R.",
        "Tobi",
        "Michi F.",
        "Fred",
        "Franky",
        "Andi",
        "Philip"
    ])
    const [lineup, setLineupIntern] = useState<Record<number, string>>({})
    const setLineup = (l: Record<number, string>) => {
        setLineupIntern(l)
        setLineupFavorites([])
    }
    const [lineupFavorites, setLineupFavorites] = useState<number[][][]>([])
    const ready = Object.values(lineup).length == 6
    const [selectedDoublesPairingFilter, setSelectedDoublesPairingFilter] = useState<number[][]>([])
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

    const stringify = (lineup: number[][]) => JSON.stringify(lineup)
    const isFavorite = (lineup: number[][]) => {
        const list = lineupFavorites.map(stringify)
        const element = stringify(lineup);
        return _.includes(list, element)
    }
    const toggleFavorite = (lineup: number[][]) => {
        const list = lineupFavorites.map(stringify)
        const element = stringify(lineup)
        if(!_.includes(list, element)){
            setLineupFavorites([...lineupFavorites, lineup])
        }else {
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
    }
    const isEqual = (pair1: number[]) => {
        return (pair2: number[]) => pair1[0] == pair2[0] && pair1[1] == pair2[1];
    }
    const isNotEqual = (pair1: number[]) => {
        return (pair2: number[]) => pair1[0] != pair2[0] || pair1[1] != pair2[1];
    }
    const toString = (pair: number[]) => {
        return `${pair[0]} - ${pair[1]}`
    }

    const renderDoublesPairingText = (p1: number, p2: number) => {
        return `(${p1} + ${p2} = ${p1+p2}) ${Object.values(lineup)[p1 - 1]} + ${Object.values(lineup)[p2 - 1]}`
    }

    const allSelectedDoublesPairingFiltersCombinedPredicate = selectedDoublesPairingFilter
        .map(doublesPairing => (lineup: number[][]) => lineup.find(isEqual(doublesPairing)) != undefined)
        .reduce((acc, curr) => (lineup: number[][]) => acc(lineup) && curr(lineup), (lineup: number[][]) => true)

    const withFavoriteFilter = (filter: (_: number[][]) => boolean) => {
        const isWithinFavorites = (lineup: number[][]) => _.includes(lineupFavorites.map(stringify), stringify(lineup))
        return (lineup: number[][]) => showFavoritesOnly ? isWithinFavorites(lineup) && filter(lineup) : filter(lineup)
    }

    let filteredLineupVariations = allPossibleLineupVariations.filter(withFavoriteFilter(allSelectedDoublesPairingFiltersCombinedPredicate));

    const allPossibleFilters = _.uniqBy(allPossibleLineupVariations.flat(), toString)
    const remainingDoublesPairingFilters: Record<string, number[]> = _.uniqBy(filteredLineupVariations.flat(), toString).reduce((acc, curr) => {
        return {...acc, [toString(curr)]: curr}
    }, {})

    const CustomDivider : React.FC<{children?: ReactNode}> = (props) => (
        <Divider style={{marginTop: '20px', marginBottom: '20px'}}>{props.children}</Divider>)

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <CustomDivider>Spielereingabe</CustomDivider>
            <form
                onSubmit={(event) => {
                    setPlayers([...players, inputText])
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
                        <Grid container item key={entry} direction={"row"} justifyContent={"flex-start"}
                              alignItems={"center"} spacing={1}>
                            <Grid item style={{paddingRight: '10px'}}>
                                <Checkbox checked={lineup[index+1] !== undefined} onChange={(e) => {
                                    if (e.target.checked) {
                                        setLineup({...lineup, [index + 1]: entry})
                                    } else {
                                        setLineup(_.omit(lineup, [index + 1]))
                                    }
                                }}/>
                            </Grid>
                            <Grid item sx={{flexGrow: 1}}>{entry}</Grid>
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
            {
                ready && <>
                    <CustomDivider>Filter</CustomDivider>
                    <Grid container spacing={2} direction={"column"} alignItems={"stretch"} justifyContent={"space-evenly"}>
                        <Grid item xs>
                            <Chip style={{width: '100%'}} key={999} variant={showFavoritesOnly ? 'filled': 'outlined'}
                                  color={'primary'}
                                  label={"Nach Favoriten filtern"}
                                  onClick={() => {
                                          setShowFavoritesOnly(!showFavoritesOnly)
                                  }}/>
                        </Grid>
                        {
                            allPossibleFilters.map((doublePairingFilter, index) => {
                                const active = selectedDoublesPairingFilter.find(isEqual(doublePairingFilter)) != undefined
                                const disabled = remainingDoublesPairingFilters[toString(doublePairingFilter)] === undefined
                                const style: {variant: 'filled' | 'outlined', color: 'default' | 'primary'} = active ? ({variant: 'filled', color: 'primary'}) : disabled ? ({
                                    variant: 'filled',
                                    color: 'default'
                                }) : ({variant: 'outlined', color: 'primary'})
                                // const variant= disabled ? 'outlined' : undefined
                                return (
                                    <Grid item xs key={`grid-${index}`}>
                                        <Chip style={{width: '100%'}} key={`chip-${index}`} variant={style.variant}
                                              color={style.color}
                                              label={renderDoublesPairingText(doublePairingFilter[0], doublePairingFilter[1])}
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
            }

            {
                ready && <>
                    <CustomDivider>Doppelvarianten</CustomDivider>
                    <Grid container direction={"column"} rowSpacing={3} alignItems={'center'}>
                        {filteredLineupVariations.map((lineupVariation, index) =>
                            <Grid item container key={index} direction={"column"} rowSpacing={1}>
                                <Grid item>
                                    <CustomDivider>
                                        Variante {index+1}
                                    </CustomDivider>
                                </Grid>
                                <Grid item>
                                    <Grid item container direction={"row"} spacing={2} alignItems={"center"}>
                                        <Grid item>
                                            { isFavorite(lineupVariation) ?
                                                (<IconButton aria-label="star" onClick={() => {
                                                    toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarIcon color={"primary"} />
                                                </IconButton>):
                                                (<IconButton aria-label="unstar" onClick={() => {
                                                    toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarBorderIcon color={"primary"} />
                                                </IconButton>)
                                            }
                                        </Grid>
                                        <Grid item>
                                            <Grid item container direction={"column"}>
                                                {lineupVariation.map((doublesPairing,index) =>
                                                    <Grid item key={index}>
                                                        {renderDoublesPairingText(doublesPairing[0], doublesPairing[1])}
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
        </main>
    )
}
