import {CustomDivider} from "@/app/customDivider";
import {Card, CardContent, CardHeader, Grid, IconButton, Paper} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import {DoublesPairing} from "@/app/page";
import _ from "lodash";
import React from "react";

export const Favorites: React.FC<{
    lineupFavorites: DoublesPairing[][],
    toggleFavorite: (_: DoublesPairing[]) => void,
    isFavorite: (_: DoublesPairing[]) => boolean,
    renderDoublesPairingText: ({player1, player2}: DoublesPairing) => string,
}> = (props) => {

    const groups = props.lineupFavorites.reduce((acc, pairings) => {
        const playersWithinVariation = pairings.flatMap(pairing => {
            return [pairing.player1, pairing.player2]
        })
        const sorted = _.sortBy(playersWithinVariation, (player) => {
            return player.lineupPosition
        }).map((player) => player.name)
        const key = JSON.stringify(sorted)
        return {
            ...acc,
            [key]: [...acc[key] || [], pairings]
        }
    }, {} as Record<string, DoublesPairing[][]>)

    const allPlayers = _.uniqBy(Object.keys(groups).flatMap(stringifiedPlayers => JSON.parse(stringifiedPlayers) as string[]), (p)=>p)


    const getWithoutTitle = (pairings: DoublesPairing[][]): string => {
        const groupPlayers = _.uniqBy(pairings.flatMap(pairing => pairing.flatMap(pair => [pair.player1.name, pair.player2.name])), (p) => p)
        const missingPlayers = _.without(allPlayers,...groupPlayers);
        if(missingPlayers.length === 0){
            return `Alle Spieler`
        }
        const names = _.join(missingPlayers,", ")
        return `Ohne: ${names}`
    }

    return <>
        <CustomDivider>Favoriten</CustomDivider>
        {Object.values(groups).map((lineupVariations, groupIndex) => {
                return <Card key={groupIndex} style={{margin: 10}} raised={true}>
                    <CardContent>
                        <CardHeader title={`Aufstellung ${groupIndex + 1}`} subheader={getWithoutTitle(lineupVariations)}/>
                    {
                        lineupVariations.map((lineupVariation, index) =>
                            <Grid item container key={index} direction={"column"} rowSpacing={1}>
                                <Grid item>
                                    <CustomDivider>
                                        Variante {groupIndex+1}.{index + 1}
                                    </CustomDivider>
                                </Grid>
                                <Grid item>
                                    <Grid item container direction={"row"} spacing={2} alignItems={"center"}>
                                        <Grid item>
                                            {props.isFavorite(lineupVariation) ?
                                                (<IconButton aria-label="star" onClick={() => {
                                                    props.toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarIcon color={"primary"}/>
                                                </IconButton>) :
                                                (<IconButton aria-label="unstar" onClick={() => {
                                                    props.toggleFavorite(lineupVariation)
                                                }}>
                                                    <StarBorderIcon color={"primary"}/>
                                                </IconButton>)
                                            }
                                        </Grid>
                                        <Grid item>
                                            <Grid item container direction={"column"}>
                                                {lineupVariation.map((doublesPairing, index) =>
                                                    <Grid item key={index}>
                                                        {props.renderDoublesPairingText(doublesPairing)}
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        )
                    }
                    </CardContent>
                </Card>

            }
        )}

    </>
}