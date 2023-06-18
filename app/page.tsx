'use client'
import {Button, Input} from "@mui/joy";
import {useState} from "react";

export default function Home() {

    const [inputText, setInputText] = useState("")
    const [meldeliste, setMeldeListe] = useState<string[]>([])
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
            {meldeliste.map((entry) => <div key={entry}>{entry}</div>)}
        </main>
    )
}
