'use client'
import {Input} from "@mui/joy";
import {useState} from "react";
import _ from "lodash";
import {Button, Checkbox, List, ListItem, Divider, Chip} from "@mui/material";

export default function Home() {

    const pairings = [[[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 5], [4, 6]], [[1, 2], [3, 6], [4, 5]], [[1, 2], [4, 5], [3, 6]], [[1, 3], [2, 4], [5, 6]], [[1, 3], [2, 5], [4, 6]], [[1, 3], [2, 6], [4, 5]], [[1, 4], [2, 3], [5, 6]], [[1, 4], [2, 5], [3, 6]], [[1, 4], [2, 6], [3, 5]], [[1, 4], [3, 5], [2, 6]], [[1, 5], [2, 4], [3, 6]], [[1, 5], [3, 4], [2, 6]], [[1, 6], [2, 5], [3, 4]], [[1, 6], [3, 4], [2, 5]], [[2, 3], [1, 4], [5, 6]], [[2, 3], [1, 5], [4, 6]], [[2, 3], [1, 6], [4, 5]], [[2, 4], [1, 5], [3, 6]], [[2, 4], [1, 6], [3, 5]], [[2, 5], [1, 6], [3, 4]], [[3, 4], [1, 6], [2, 5]]]
    const [inputText, setInputText] = useState("")
    const [players, setPlayers] = useState<string[]>(["A", "B", "C", "D", "E", "F"])
    const [lineup, setLineup] = useState<Record<number, string>>({})
    const ready = Object.values(lineup).length == 6
    const [filters, setFilters] = useState<number[][]>([])
    console.log(filters)
    const uniquePairs =
        _.sortBy(
            _.uniqBy(pairings.flat(), pair => `${pair[0]}, ${pair[1]}`), p => p[0]
        )
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
                    ready && uniquePairs.map((doppel, doppelIndex) => {
                        const labelText = `${doppel[0]} & ${doppel[1]}`
                        const active = filters.find(f => f[0] == doppel[0] && f[1] == doppel[1]) != undefined
                        if (active) {
                            return <Chip key={doppelIndex} label={labelText} onDelete={() => {
                                setFilters(filters.filter(f => f[0] != doppel[0] || f[1] != doppel[1]))
                            }}/>
                        } else {
                            return <Chip key={doppelIndex} label={labelText} onClick={() => {
                                setFilters([...filters, doppel])
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
                            {pairings.map((doppelaufstellung, index) => <List key={index}> Variante {index}
                                {doppelaufstellung.map(doppel =>
                                    <ListItem>{Object.values(lineup)[doppel[0] - 1]} + {Object.values(lineup)[doppel[1] - 1]}</ListItem>)}</List>)}
                            <Divider/>
                        </List>
                    </>
                }
            </div>
        </main>
    )
}
