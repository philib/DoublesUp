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
    return (
        <Grid item container direction={'row'}>
            <Grid item>
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
            <Grid item>
                <Grid item container direction={'column'}>
                    {variation.map((doublesPairing, index) => (
                        <Grid
                            key={`variation-${index}`}
                            item
                            container
                            direction={'row'}
                            spacing={2}
                            alignItems={'center'}
                        >
                            <Grid item key={index}>
                                <Typography>
                                    {doublesPairing
                                        .map(
                                            (player) =>
                                                `(${player.position}) ${getPlayerNameById(player.value)}`
                                        )
                                        .join(' + ')}
                                </Typography>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
};
