import {Player} from "@/app/page";
import {Button, Checkbox, Grid, Input} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import _ from "lodash";
import DeleteIcon from "@mui/icons-material/Delete";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import React, {useEffect, useState} from "react";
import {CustomDivider} from "@/app/customDivider";


export interface Lineup {
    1: Player,
    2: Player,
    3: Player,
    4: Player,
    5: Player,
    6: Player,
}

export const Players: React.FC<{
    show: boolean
    players: Player[]
    onPlayersChange: (_: Player[]) => void
    onLineupChange: (_: Lineup | undefined) => void
}> = (props) => {
    const [inputText, setInputText] = useState("")
    const [lineup, setLineup] = useState<Record<number, Player>>({})
    const lineupFlat = Object.values(lineup);
    useEffect(() => {
        if (lineupFlat.length === 6) {
            const newLineUp = lineupFlat.reduce((acc, curr, currentIndex) => ({
                ...acc,
                [currentIndex + 1]: curr
            }), {} as Lineup)
            props.onLineupChange(newLineUp)
        } else {
            props.onLineupChange(undefined)
        }
    }, [lineup])

    const movePlayerUp = (player: number) => {
        const playerIndex = player - 1
        const nextPlayerIndex = player - 2
        if (playerIndex === 0) {
            return
        }
        const newPlayers = [...props.players]
        newPlayers[nextPlayerIndex] = props.players[playerIndex]
        newPlayers[playerIndex] = props.players[nextPlayerIndex]
        props.onPlayersChange(newPlayers)
        setLineup({})
    }
    const movePlayerDown = (player: number) => {
        const playerIndex = player - 1
        const prevPlayerIndex = player
        if (playerIndex === props.players.length - 1) {
            return
        }
        const newPlayers = [...props.players]
        newPlayers[prevPlayerIndex] = props.players[playerIndex]
        newPlayers[playerIndex] = props.players[prevPlayerIndex]
        props.onPlayersChange(newPlayers)
        setLineup({})
    }
    if (!props.show) {
        return <></>
    }

    return (
        <>
            <CustomDivider>Spielereingabe</CustomDivider>
            <form
                onSubmit={(event) => {
                    props.onPlayersChange([...props.players, {name: inputText}])
                    event.preventDefault();
                }}
                style={{marginBottom: '10px'}}
            >
                <Input
                    style={{width: '100%'}}
                    placeholder="Neue Spieler hinzufügen"
                    required
                    onChange={(t) => setInputText(t.target.value)}
                    sx={{mb: 1, fontSize: 'var(--joy-fontSize-sm)'}}
                />
                <Button type="submit" style={{width: '100%'}}><AddIcon/></Button>
            </form>
            <CustomDivider>Spielerliste</CustomDivider>
            <Grid container rowSpacing={3} direction={"column"}>
                {props.players.map((entry, index) =>
                    <>
                        <CustomDivider></CustomDivider>
                        <Grid container item key={entry.name} direction={"row"} justifyContent={"flex-start"}
                              alignItems={"center"} spacing={1}>
                            <Grid item style={{paddingRight: '10px'}}>
                                <Checkbox checked={lineup[index + 1] !== undefined} onChange={(e) => {
                                    if (e.target.checked) {
                                        setLineup({...lineup, [index + 1]: entry})
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
                                        props.onPlayersChange(_.without(props.players, entry))
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
    )
}