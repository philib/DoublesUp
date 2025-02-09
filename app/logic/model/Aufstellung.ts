export type Spieler = number

export interface SpielerAufstellung {
    nichtAufgestellteSpieler: Spieler[]
    aufgestellteSpieler: Spieler[]
}

export interface AufstellungsModifikatoren {
    spielerVonDerAufstellungEntfernen: SpielerEntfernen
    spielerZurAufstellungHinzufuegen: SpielerHinzufuegen
}

export type ValideAufstellung = {
    type: "ValideAufstellung"
} & SpielerAufstellung & AufstellungsModifikatoren

export type InvalideAufstellung = {
    type: "InvalideAufstellung"
} & SpielerAufstellung & AufstellungsModifikatoren

export interface Fehler {
    type: "Fehler"
    grund: string
}

export type SpielerEntfernen = (spieler: Spieler) => Aufstellung
export type SpielerHinzufuegen = (spieler: Spieler) => Aufstellung

export type Aufstellung = ValideAufstellung | InvalideAufstellung | Fehler

export type AufstellungsValidierung = (aufgestellteSpieler: Spieler[]) => "Valide" | "Invalide"

function aufstellungsModifikation(validierung: AufstellungsValidierung, aktuelleSpielerAufstellung: SpielerAufstellung, modifikator: (spieler: Spieler) => SpielerAufstellung): (spieler: Spieler) => Aufstellung {
    return (spieler) => {
        if (!aktuelleSpielerAufstellung.nichtAufgestellteSpieler.includes(spieler) && !aktuelleSpielerAufstellung.aufgestellteSpieler.includes(spieler)) {
            return {
                type: "Fehler",
                grund: "Spieler nicht in Meldeliste"
            }
        }
        const neueSpielerAufstellung = modifikator(spieler);
        const validerteAufstellung = validierung(neueSpielerAufstellung.aufgestellteSpieler);
        return ({
            type: validerteAufstellung === "Valide" ? "ValideAufstellung" : "InvalideAufstellung",
            ...neueSpielerAufstellung,
            spielerVonDerAufstellungEntfernen: spielerVonDerAufstellungEntfernen(validierung, neueSpielerAufstellung),
            spielerZurAufstellungHinzufuegen: spielerZurAufstellungHinzufuegen(validierung, neueSpielerAufstellung),
        })
    }
}

function spielerZurAufstellungHinzufuegen(validierung: AufstellungsValidierung, aktuelleSpielerAufstellung: SpielerAufstellung): (spieler: Spieler) => Aufstellung {
    return aufstellungsModifikation(validierung, aktuelleSpielerAufstellung, (spieler) => ({
        nichtAufgestellteSpieler: aktuelleSpielerAufstellung.nichtAufgestellteSpieler.filter(it => it !== spieler),
        aufgestellteSpieler: aktuelleSpielerAufstellung.aufgestellteSpieler.includes(spieler) ? aktuelleSpielerAufstellung.aufgestellteSpieler : [...aktuelleSpielerAufstellung.aufgestellteSpieler, spieler].sort()
    }))
}

function spielerVonDerAufstellungEntfernen(validierung: AufstellungsValidierung, aufstellung: SpielerAufstellung): (spieler: Spieler) => Aufstellung {
    return aufstellungsModifikation(validierung, aufstellung, (spieler) => ({
        nichtAufgestellteSpieler: aufstellung.nichtAufgestellteSpieler.includes(spieler) ? aufstellung.nichtAufgestellteSpieler : [...aufstellung.nichtAufgestellteSpieler, spieler].sort(),
        aufgestellteSpieler: aufstellung.aufgestellteSpieler.filter(it => it !== spieler)
    }))
}

export function initialeAufstellung(meldeListe: Spieler[], validierung: (spieler: Spieler[]) => boolean): InvalideAufstellung {
    const aufstellungsValidierung: AufstellungsValidierung = (spieler: Spieler[]) => validierung(spieler) ? "Valide" : "Invalide";
    const aufstellung = {
        nichtAufgestellteSpieler: meldeListe,
        aufgestellteSpieler: []
    };
    return {
        type: "InvalideAufstellung",
        nichtAufgestellteSpieler: meldeListe,
        aufgestellteSpieler: [],
        spielerVonDerAufstellungEntfernen: spielerVonDerAufstellungEntfernen(aufstellungsValidierung, aufstellung),
        spielerZurAufstellungHinzufuegen: spielerZurAufstellungHinzufuegen(aufstellungsValidierung, aufstellung),
    }
}
