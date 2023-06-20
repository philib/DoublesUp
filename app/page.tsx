'use client'
import {Input} from "@mui/joy";
import {useState} from "react";
import _, {reduce} from "lodash";
import {Button, Checkbox, Chip, Divider, List, ListItem} from "@mui/material";

export default function Home() {
    const allPossibleLineupVariations = [[[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 5], [4, 6]], [[1, 2], [3, 6], [4, 5]], [[1, 2], [4, 5], [3, 6]], [[1, 3], [2, 4], [5, 6]], [[1, 3], [2, 5], [4, 6]], [[1, 3], [2, 6], [4, 5]], [[1, 4], [2, 3], [5, 6]], [[1, 4], [2, 5], [3, 6]], [[1, 4], [2, 6], [3, 5]], [[1, 4], [3, 5], [2, 6]], [[1, 5], [2, 4], [3, 6]], [[1, 5], [3, 4], [2, 6]], [[1, 6], [2, 5], [3, 4]], [[1, 6], [3, 4], [2, 5]], [[2, 3], [1, 4], [5, 6]], [[2, 3], [1, 5], [4, 6]], [[2, 3], [1, 6], [4, 5]], [[2, 4], [1, 5], [3, 6]], [[2, 4], [1, 6], [3, 5]], [[2, 5], [1, 6], [3, 4]], [[3, 4], [1, 6], [2, 5]]]
    const [inputText, setInputText] = useState("")
    const [players, setPlayers] = useState<string[]>(["A", "B", "C", "D", "E", "F"])
    const [lineup, setLineup] = useState<Record<number, string>>({})
    const ready = Object.values(lineup).length == 6
    const [selectedDoublesPairingFilter, setSelectedDoublesPairingFilter] = useState<number[][]>([])

    const isEqual = (pair1: number[]) => {
        return (pair2 : number[] ) => pair1[0] == pair2[0] && pair1[1] == pair2[1];
    }
    const isNotEqual = (pair1: number[]) => {
        return (pair2 : number[] ) => pair1[0] != pair2[0] || pair1[1] != pair2[1];
    }
    const toString = (pair: number[])=> {
        return `${pair[0]} - ${pair[1]}`
    }

    const allSelectedDoublesPairingFiltersCombinedPredicate = selectedDoublesPairingFilter
        .map(doublesPairing => (lineup: number[][]) => lineup.find(isEqual(doublesPairing)) != undefined)
        .reduce((acc, curr) => (lineup: number[][]) => acc(lineup) && curr(lineup), (lineup: number[][]) => true)

    let filteredLineupVariations = allPossibleLineupVariations.filter(allSelectedDoublesPairingFiltersCombinedPredicate);

    const allPossibleFilters = _.uniqBy(allPossibleLineupVariations.flat(), toString)
    const remainingDoublesPairingFilters = _.uniqBy(filteredLineupVariations.flat(), toString).reduce((acc, curr)=> {
       return {...acc, [toString(curr)]: curr}
    }, {})

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form
                onSubmit={(event) => {
                    setPlayers([...players, inputText])
                    event.preventDefault();
                }}
            >
                <Input
                    placeholder="Try to submit with no text!"
                    required
                    onChange={(t) => setInputText(t.target.value)}
                    sx={{mb: 1, fontSize: 'var(--joy-fontSize-sm)'}}
                />
                <Button type="submit">Submit</Button>
            </form>
            <div>
                {players.map((entry, index) => <p key={entry}><Checkbox onChange={(e) => {
                    if (e.target.checked) {
                        setLineup({...lineup, [index + 1]: entry})
                    } else {
                        setLineup(_.omit(lineup, [index + 1]))
                    }
                }}/> {entry} <Button variant="contained"
                                     onClick={() => {
                                         setPlayers(_.without(players, entry))
                                         setLineup(_.omit(lineup, [index + 1]))
                                     }}> Remove </Button></p>)}
            </div>
            <div>
                {
                    ready && allPossibleFilters.map((doublePairingFilter, index) => {
                        const labelText = `${Object.values(lineup)[doublePairingFilter[0] - 1]} & ${Object.values(lineup)[doublePairingFilter[1] - 1]}`
                        const active = selectedDoublesPairingFilter.find(isEqual(doublePairingFilter)) != undefined
                        const disabled = remainingDoublesPairingFilters[toString(doublePairingFilter)] == undefined
                        // const variant= disabled ? 'outlined' : undefined
                        if (active) {
                            return <Chip key={index} color={'primary'} label={labelText} onDelete={() => {
                                setSelectedDoublesPairingFilter(selectedDoublesPairingFilter.filter(isNotEqual(doublePairingFilter)))
                            }}/>
                        } else {
                            return <Chip key={index} color={disabled ? 'default': 'success'}label={labelText} onClick={() => {
                                if(!disabled){
                                    setSelectedDoublesPairingFilter([...selectedDoublesPairingFilter, doublePairingFilter])
                                }
                            }}/>
                        }
                    })
                }
            </div>
            <div>
                {
                    ready && <>
                        Aufstellung:
                        <List>
                            {filteredLineupVariations.map((lineupVariation, index) => <List key={index}> Variante {index}
                                {lineupVariation.map(doublesPairing =>
                                    <ListItem>{Object.values(lineup)[doublesPairing[0] - 1]} + {Object.values(lineup)[doublesPairing[1] - 1]}</ListItem>)}</List>)}
                            <Divider/>
                        </List>
                    </>
                }
            </div>
        </main>
    )
}
