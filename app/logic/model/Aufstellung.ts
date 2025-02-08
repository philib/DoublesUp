export type Spieler = number

export interface AufstellungsPaarung {
    paarungsWert: number;
    spielerSortiertNachRang: Spieler[]
}

export interface AufstellungsVariante {
    paarungen: AufstellungsPaarung[]
}

export interface SpielerAufstellung {
    nichtAufgestellteSpieler: Spieler[]
    aufgestellteSpieler: Spieler[]
}

export interface ValideAufstellung {
    type: "ValideAufstellung"
    varianten: AufstellungsVariante[]
    nichtAufgestellteSpieler: Spieler[]
    aufgestellteSpieler: Spieler[]
    spielerVonDerAufstellungEntfernen: SpielerEntfernen
    spielerZurAufstellungHinzufuegen: SpielerHinzufuegen
}

export interface InvalideAufstellung {
    type: "InvalideAufstellung"
    nichtAufgestellteSpieler: Spieler[]
    aufgestellteSpieler: Spieler[]
    spielerVonDerAufstellungEntfernen: SpielerEntfernen
    spielerZurAufstellungHinzufuegen: SpielerHinzufuegen
}

export interface Fehler {
    type: "Fehler"
    grund: string
}

export type Aufstellung = ValideAufstellung | InvalideAufstellung | Fehler

export type AufstellungsValidierung = (aufgestellteSpieler: Spieler[]) => ({
    type: "Valide",
    berechneVarianten: (spieler: Spieler[]) => AufstellungsVariante[]
}) | ({ type: "Invalide" })

function spielerZurAufstellungHinzufuegen(validierung: AufstellungsValidierung, a: SpielerAufstellung): (spieler: Spieler) => Aufstellung {
    return (spieler) => {
        if (!a.nichtAufgestellteSpieler.includes(spieler) && !a.aufgestellteSpieler.includes(spieler)) {
            return {
                type: "Fehler",
                grund: "Spieler nicht in Meldeliste"
            }
        }
        const aa = {
            nichtAufgestellteSpieler: a.nichtAufgestellteSpieler.filter(it => it !== spieler),
            aufgestellteSpieler: a.aufgestellteSpieler.includes(spieler) ? a.aufgestellteSpieler : [...a.aufgestellteSpieler, spieler].sort()
        }
        const neueSpielerAufstellungen = {
            ...aa,
            spielerVonDerAufstellungEntfernen: spielerVonDerAufstellungEntfernen(validierung, aa),
            spielerZurAufstellungHinzufuegen: spielerZurAufstellungHinzufuegen(validierung, aa),
        }
        const validerteAufstellung = validierung(neueSpielerAufstellungen.aufgestellteSpieler);
        return validerteAufstellung.type === "Valide" ? ({
            type: "ValideAufstellung",
            varianten: validerteAufstellung.berechneVarianten(neueSpielerAufstellungen.aufgestellteSpieler),
            ...neueSpielerAufstellungen
        }) : ({
            type: "InvalideAufstellung",
            ...neueSpielerAufstellungen
        })
    }
}

type SpielerEntfernen = (spieler: Spieler) => Aufstellung
type SpielerHinzufuegen = (spieler: Spieler) => Aufstellung

function spielerVonDerAufstellungEntfernen(validierung: AufstellungsValidierung, aufstellung: SpielerAufstellung): (spieler: Spieler) => Aufstellung {
    return (spieler) => {
        if (!aufstellung.aufgestellteSpieler.includes(spieler) && !aufstellung.nichtAufgestellteSpieler.includes(spieler)) {
            return {
                type: "Fehler",
                grund: "Spieler nicht in Aufstellung"
            }
        }
        const aa = {
            nichtAufgestellteSpieler: aufstellung.nichtAufgestellteSpieler.includes(spieler) ? aufstellung.nichtAufgestellteSpieler : [...aufstellung.nichtAufgestellteSpieler, spieler].sort(),
            aufgestellteSpieler: aufstellung.aufgestellteSpieler.filter(it => it !== spieler)
        }
        const neueSpielerAufstellungen = {
            ...aa,
            spielerVonDerAufstellungEntfernen: spielerVonDerAufstellungEntfernen(validierung, aa),
            spielerZurAufstellungHinzufuegen: spielerZurAufstellungHinzufuegen(validierung, aa),
        }
        const validierteAufstellung = validierung(neueSpielerAufstellungen.aufgestellteSpieler);
        return validierteAufstellung.type === "Valide" ? ({
            type: "ValideAufstellung",
            varianten: validierteAufstellung.berechneVarianten(neueSpielerAufstellungen.aufgestellteSpieler),
            ...neueSpielerAufstellungen
        }) : ({
            type: "InvalideAufstellung",
            ...neueSpielerAufstellungen
        })
    }
}

export function initialeAufstellung(meldeListe: Spieler[], validierung: (spieler: Spieler[]) => boolean, variantenBerechnung: (aufstellung: Spieler[]) => AufstellungsVariante[]): InvalideAufstellung {
    const mapped: AufstellungsValidierung = (spieler: Spieler[]) => validierung(spieler) ? ({
        type: "Valide",
        berechneVarianten: variantenBerechnung
    }) : ({type: "Invalide"})
    const aufstellung = {
        nichtAufgestellteSpieler: meldeListe,
        aufgestellteSpieler: []
    };
    return {
        type: "InvalideAufstellung",
        nichtAufgestellteSpieler: meldeListe,
        aufgestellteSpieler: [],
        spielerVonDerAufstellungEntfernen: spielerVonDerAufstellungEntfernen(mapped, aufstellung),
        spielerZurAufstellungHinzufuegen: spielerZurAufstellungHinzufuegen(mapped, aufstellung),
    }
}

type a = () => (aufstellung: ValideAufstellung) => AufstellungsVariante[]