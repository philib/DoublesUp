import {Grid, IconButton, Typography} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import {PlayerId} from '../../logic/RegistrationList';
import React from "react";

export type Variation = [
    { position: number; value: PlayerId },
    { position: number; value: PlayerId }
][];

export interface Lineup {
    activePlayers: { id: PlayerId }[];
    inactivePlayers: { id: PlayerId }[];
    variations: Variation[];
}

export const VariationComponent: React.FC<{
    variation: Variation;
    getPlayerNameById: (id: PlayerId) => string;
    isFavorite: boolean;
    favorize: () => void;
    unfavorize: () => void;
}> = ({variation, getPlayerNameById, favorize, unfavorize, isFavorite}) => {
    const plus = 0.5;
    const player = (12/2) - (plus/2)
    return (
        <Grid item container direction={'row'} alignItems={'center'} justifyContent={'center'} wrap={'nowrap'} flexGrow={1}>
            <Grid item xs={1} paddingRight={6}>
                {isFavorite ? (
                    <IconButton
                        aria-label="star"
                        onClick={() => {
                            unfavorize();
                        }}
                    >
                        <StarIcon color={'primary'}/>
                    </IconButton>
                ) : (
                    <IconButton
                        aria-label="unstar"
                        onClick={() => {
                            favorize();
                        }}
                    >
                        <StarBorderIcon color={'primary'}/>
                    </IconButton>
                )}
            </Grid>
            <Grid item xs={11}>
                <Grid item container direction={'column'} spacing={1}>
                    {variation.map(([first, second], index) => (
                        <Grid
                            key={`variation-${index}`}
                            item
                            container
                            direction={'row'}
                            spacing={0.5}
                            alignItems={'center'}
                        >
                            <Grid item
                                  key={index} xs={player}>
                                <Typography noWrap={true}>
                                    {`(${first.position}) ${getPlayerNameById(first.value)}`}
                                </Typography>
                            </Grid>
                            <Grid item
                                  key={index} xs={plus}>
                                <Typography>
                                    +
                                </Typography>
                            </Grid>
                            <Grid item
                                  key={index} xs={player}>
                                <Typography noWrap={true}>
                                    {`(${second.position}) ${getPlayerNameById(second.value)}`}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};
