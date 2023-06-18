'use client'
import {Input} from "@mui/joy";
import {useState} from "react";
import _ from "lodash";
import {Button, Checkbox, List, ListItem, Divider} from "@mui/material";

export default function Home() {

    const pairings = [[[1, 2], [3, 4], [5, 6]], [[1, 2], [3, 5], [4, 6]], [[1, 2], [3, 6], [4, 5]], [[1, 2], [4, 5], [3, 6]], [[1, 3], [2, 4], [5, 6]], [[1, 3], [2, 5], [4, 6]], [[1, 3], [2, 6], [4, 5]], [[1, 4], [2, 3], [5, 6]], [[1, 4], [2, 5], [3, 6]], [[1, 4], [2, 6], [3, 5]], [[1, 4], [3, 5], [2, 6]], [[1, 5], [2, 4], [3, 6]], [[1, 5], [3, 4], [2, 6]], [[1, 6], [2, 5], [3, 4]], [[1, 6], [3, 4], [2, 5]], [[2, 3], [1, 4], [5, 6]], [[2, 3], [1, 5], [4, 6]], [[2, 3], [1, 6], [4, 5]], [[2, 4], [1, 5], [3, 6]], [[2, 4], [1, 6], [3, 5]], [[2, 5], [1, 6], [3, 4]], [[3, 4], [1, 6], [2, 5]]]
    const [inputText, setInputText] = useState("")
    const [meldeliste, setMeldeListe] = useState<string[]>(["A", "B", "C", "D", "E", "F"])
    const [aufstellung, setAufstellung] = useState<Record<number, string>>({})
    const ready = Object.values(aufstellung).length >= 6
    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form
                onSubmit={(event) => {
                    setMeldeListe([...meldeliste, inputText])
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
                {meldeliste.map((entry, index) => <p key={entry}><Checkbox onChange={(e) => {
                    if (e.target.checked) {
                        setAufstellung({...aufstellung, [index + 1]: entry})
                    } else {
                        setAufstellung(_.omit(aufstellung, [index + 1]))
                    }
                }}/> {entry} <Button variant="contained"
                                     onClick={() => setMeldeListe(_.without(meldeliste, entry))}> Remove </Button></p>)}
            </div>
            <div>
                {
                    ready && <>
                        Aufstellung:
                        <List>
                            {pairings.map((doppelaufstellung, index) => <List> Variante {index}
                                {doppelaufstellung.map(doppel =>
                                    <ListItem>{aufstellung[doppel[0]]} + {aufstellung[doppel[1]]}</ListItem>)}</List>)}
                            <Divider/>
                        </List>
                    </>
                }
            </div>
        </main>
    )
}
