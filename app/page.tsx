'use client'
import {Button, Input} from "@mui/joy";

export default function Home() {


    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <form
                onSubmit={(event) => {
                    event.preventDefault();
                }}
            >
                <Input
                    placeholder="Try to submit with no text!"
                    required
                    sx={{mb: 1, fontSize: 'var(--joy-fontSize-sm)'}}
                />
                <Button type="submit">Submit</Button>
            </form>
        </main>
    )
}
