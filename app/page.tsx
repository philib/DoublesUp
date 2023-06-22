'use client'
import {Input} from "@mui/joy";
import {useState} from "react";
import _, {reduce} from "lodash";
import {Button, Checkbox, Container, Chip, Divider, List, ListItem, Stack, Grid} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';

export default function Home() {
    const allPossibleLineupVariations = [[[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 5], [4, 6]], [[1, 2], [3, 6], [4, 5]], [[1, 2], [4, 5], [3, 6]], [[1, 3], [2, 4], [5, 6]], [[1, 3], [2, 5], [4, 6]], [[1, 3], [2, 6], [4, 5]], [[1, 4], [2, 3], [5, 6]], [[1, 4], [2, 5], [3, 6]], [[1, 4], [2, 6], [3, 5]], [[1, 4], [3, 5], [2, 6]], [[1, 5], [2, 4], [3, 6]], [[1, 5], [3, 4], [2, 6]], [[1, 6], [2, 5], [3, 4]], [[1, 6], [3, 4], [2, 5]], [[2, 3], [1, 4], [5, 6]], [[2, 3], [1, 5], [4, 6]], [[2, 3], [1, 6], [4, 5]], [[2, 4], [1, 5], [3, 6]], [[2, 4], [1, 6], [3, 5]], [[2, 5], [1, 6], [3, 4]], [[3, 4], [1, 6], [2, 5]]]
    const [inputText, setInputText] = useState("")
    const [players, setPlayers] = useState<string[]>(["A", "B", "C", "D", "E", "F"])
    const [lineup, setLineup] = useState<Record<number, string>>({})
    const ready = Object.values(lineup).length == 6
    const [selectedDoublesPairingFilter, setSelectedDoublesPairingFilter] = useState<number[][]>([])

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
        return `(${p1} + ${p2}) ${players[p1 - 1]} + ${players[p2 - 1]}`
    }

    const allSelectedDoublesPairingFiltersCombinedPredicate = selectedDoublesPairingFilter
        .map(doublesPairing => (lineup: number[][]) => lineup.find(isEqual(doublesPairing)) != undefined)
        .reduce((acc, curr) => (lineup: number[][]) => acc(lineup) && curr(lineup), (lineup: number[][]) => true)

    let filteredLineupVariations = allPossibleLineupVariations.filter(allSelectedDoublesPairingFiltersCombinedPredicate);

    const allPossibleFilters = _.uniqBy(allPossibleLineupVariations.flat(), toString)
    const remainingDoublesPairingFilters = _.uniqBy(filteredLineupVariations.flat(), toString).reduce((acc, curr) => {
        return {...acc, [toString(curr)]: curr}
    }, {})

    const CustomDivider: React.FC = (props) => (
        <Divider style={{'margin-top': '20px', 'margin-bottom': '20px'}}>{props.children}</Divider>)

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <CustomDivider>Spielereingabe</CustomDivider>
            <form
                onSubmit={(event) => {
                    setPlayers([...players, inputText])
                    event.preventDefault();
                }}
                style={{'margin-bottom': '10px'}}
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
                    <CustomDivider>Doppelfavoriten</CustomDivider>
                    <Grid container spacing={2} direction={"column"} alignItems={"stretch"} justifyContent={"space-evenly"}>
                        {
                            allPossibleFilters.map((doublePairingFilter, index) => {
                                const active = selectedDoublesPairingFilter.find(isEqual(doublePairingFilter)) != undefined
                                const disabled = remainingDoublesPairingFilters[toString(doublePairingFilter)] == undefined
                                const style = active ? ({variant: 'filled', color: 'primary'}) : disabled ? ({
                                    variant: 'filled',
                                    color: 'default'
                                }) : ({variant: 'outlined', color: 'primary'})
                                // const variant= disabled ? 'outlined' : undefined
                                return (
                                    <Grid item xs>
                                        <Chip style={{width: '100%'}} key={index} variant={style.variant}
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
                                        Variante {index}
                                    </CustomDivider>
                                </Grid>
                                {lineupVariation.map(doublesPairing =>
                                    <Grid item>
                                        {renderDoublesPairingText(doublesPairing[0], doublesPairing[1])}
                                    </Grid>
                                )}
                            </Grid>
                        )}
                    </Grid>
                </>
            }
        </main>
    )
}
