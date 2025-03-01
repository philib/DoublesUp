type Spieler = number;

interface ValideAufstellung {
    validitaet: Validitaet.Valide;
}

interface InvalideAufstellung {
    validitaet: Validitaet.Invalide;
}

type ValidierteAufstellung = ValideAufstellung | InvalideAufstellung;

interface MixedMeldeliste {
    meldeliste: {
        maenner: Spieler[];
        frauen: Spieler[];
    }
}

interface Meldeliste {
    meldeliste: Spieler[];
}

type Team =
    ValidierteAufstellung
    & Aufstellung
    & Meldeliste
    & NichtAufgestellteSpieler

type Mixed = Team & Modifikator<Mixed>;

type Normal =
    Team
    & Modifikator<Normal>;

export enum Validitaet {
    Valide = "Valide",
    Invalide = "Invalide"
}


interface Aufstellung {
    aufstellung: Spieler[];
}

interface NichtAufgestellteSpieler {
    nichtAufgestellteSpieler: Spieler[];
}


interface Modifikator<T> {
    hinzufuegen: (spieler: Spieler) => T;
    entfernen: (spieler: Spieler) => T;
}

type MixedAufstellungsRegel = (aufstellung: MixedMeldeliste) => AufstellungsRegel;
type AufstellungsRegel = (aufstellung: Aufstellung) => Boolean;
const toValidierteAufstellung = (aufstellungRegel: AufstellungsRegel) => (aufstellung: Aufstellung) =>
    ({
        validitaet: aufstellungRegel(aufstellung) ? Validitaet.Valide : Validitaet.Invalide
    })
type Validator = (aufstellung: Aufstellung) => (ValideAufstellung | InvalideAufstellung) & Aufstellung;

function normalModifikator(meldeListe: Meldeliste, aufstellung: Aufstellung): Modifikator<Aufstellung> {
    return {
        hinzufuegen: (spieler: Spieler): Aufstellung => {
            const neueSpieler = meldeListe.meldeliste.includes(spieler) ? [...aufstellung.aufstellung, spieler] : aufstellung.aufstellung;
            return {
                aufstellung: neueSpieler.sort((a, b) => a - b)
            }
        },
        entfernen: (spieler: Spieler): Aufstellung => {
            const neueSpieler = aufstellung.aufstellung.filter(it => it !== spieler);
            return {
                aufstellung: neueSpieler.sort((a, b) => a - b)
            }
        }
    }
}

function mixedNichtAufgestellteSpieler({meldeliste}: MixedMeldeliste, aufstellung: Aufstellung): NichtAufgestellteSpieler {
    return normalNichtAufgestellteSpieler({meldeliste: [...meldeliste.maenner, ...meldeliste.frauen]}, aufstellung)
}

function normalNichtAufgestellteSpieler({meldeliste}: Meldeliste, {aufstellung}: Aufstellung): NichtAufgestellteSpieler {
    return {
        nichtAufgestellteSpieler: meldeliste.filter(it => !aufstellung.includes(it))
    }
}

export const mixed6erRegel: MixedAufstellungsRegel = ({meldeliste}: MixedMeldeliste) => ({aufstellung}: Aufstellung): boolean => {
    const aufgestellteMaenner = aufstellung.filter(it => meldeliste.maenner.includes(it)).length;
    const aufgestellteFrauen = aufstellung.filter(it => meldeliste.frauen.includes(it)).length;
    return aufgestellteMaenner >= 3 && aufgestellteFrauen >= 3
}

export const normale6erRegel: AufstellungsRegel = ({aufstellung}: Aufstellung) => {
    return aufstellung.length >= 6;
}

function validator(regel: AufstellungsRegel): Validator {
    return (aufstellung: Aufstellung) => {
        return {
            ...toValidierteAufstellung(regel)(aufstellung),
            ...aufstellung
        }
    }
}


export function initialMixed(meldeListe: MixedMeldeliste, regel: MixedAufstellungsRegel): Mixed {
    const normaleMeldeListe: Meldeliste = {
        meldeliste: [...meldeListe.meldeliste.maenner, ...meldeListe.meldeliste.frauen]
    }
    const normaleAufstellung: Aufstellung = {
        aufstellung: []
    }
    const validiere = validator(regel(meldeListe));

    const getNextModifikator = (aktuelleAufstellung: Aufstellung): Modifikator<Mixed> => {
        const modi = normalModifikator(normaleMeldeListe, aktuelleAufstellung)
        return {
            hinzufuegen: (spieler: Spieler) => {
                const neueAufstellung = modi.hinzufuegen(spieler);
                return {...validiere(neueAufstellung), ...neueAufstellung, ...normaleMeldeListe, ...mixedNichtAufgestellteSpieler(meldeListe, neueAufstellung), ...getNextModifikator(neueAufstellung)};
            },
            entfernen: (spieler: Spieler) => {
                const neueAufstellung = modi.entfernen(spieler);
                return {...validiere(neueAufstellung), ...neueAufstellung, ...normaleMeldeListe, ...mixedNichtAufgestellteSpieler(meldeListe, neueAufstellung), ...getNextModifikator(neueAufstellung)};
            }
        }
    }
    return {
        validitaet: Validitaet.Invalide,
        ...normaleAufstellung,
        ...normaleMeldeListe,
        ...getNextModifikator(normaleAufstellung),
        ...mixedNichtAufgestellteSpieler(meldeListe, normaleAufstellung),
        ...validiere
    }
}

export function initialNormal(meldeListe: Meldeliste, regel: AufstellungsRegel): Normal {
    const aufstellung: Aufstellung = {
        aufstellung: []
    }
    const f = validator(regel);

    const a = (i: Meldeliste, j: Aufstellung): Modifikator<Normal> => {
        const modi = normalModifikator(i, j)
        return {
            hinzufuegen: (spieler: Spieler) => {
                const neueAufstellung = modi.hinzufuegen(spieler);
                return {...f(neueAufstellung), ...neueAufstellung, ...i, ...normalNichtAufgestellteSpieler(i, neueAufstellung), ...a(i, neueAufstellung)};
            },
            entfernen: (spieler: Spieler) => {
                const neueAufstellung = modi.entfernen(spieler);
                return {...f(neueAufstellung), ...neueAufstellung, ...i, ...normalNichtAufgestellteSpieler(i, neueAufstellung), ...a(i, neueAufstellung)};
            }
        }
    }
    return {
        validitaet: Validitaet.Invalide,
        ...aufstellung,
        ...meldeListe,
        ...a(meldeListe, aufstellung),
        ...normalNichtAufgestellteSpieler(meldeListe, aufstellung),
        ...f
    }
}