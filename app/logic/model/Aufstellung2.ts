type Spieler = number;

interface ValideAufstellung {
    validitaet: Validitaet.Valide;
}

interface InvalideAufstellung {
    validitaet: Validitaet.Invalide;
}

type ValidierteAufstellung = ValideAufstellung | InvalideAufstellung;

interface MixedAufstellung {
    aufstellung: {
        maenner: Spieler[];
        frauen: Spieler[];
    }
}

interface MixedMeldeliste {
    meldeliste: {
        maenner: Spieler[];
        frauen: Spieler[];
    }
}

interface NormaleMeldeListe {
    meldeliste: Spieler[];
}

type Mixed =
    ValidierteAufstellung
    & MixedAufstellung
    & MixedMeldeliste
    & MixedNichtAufgestellteSpieler
    & Modifikator<Mixed>;

type Normal =
    ValidierteAufstellung
    & NormaleMeldeListe
    & NormaleAufstellung
    & NormalNichtAufgestellteSpieler
    & Modifikator<Normal>;

export enum Validitaet {
    Valide = "Valide",
    Invalide = "Invalide"
}


interface NormaleAufstellung {
    aufstellung: Spieler[];
}

interface MixedNichtAufgestellteSpieler {
    nichtAufgestellteSpieler: {
        maenner: Spieler[];
        frauen: Spieler[];
    }
}
interface NormalNichtAufgestellteSpieler {
    nichtAufgestellteSpieler: Spieler[];
}

type Aufstellung = NormaleAufstellung | MixedAufstellung

interface Modifikator<T> {
    hinzufuegen: (spieler: Spieler) => T;
    entfernen: (spieler: Spieler) => T;
}

type AufstellungsRegel<T extends Aufstellung> = (aufstellung: T) => (ValideAufstellung | InvalideAufstellung);
type Validator<T> = (aufstellung: T) => (ValideAufstellung | InvalideAufstellung) & T;

function mixedModifikator(meldeListe: MixedMeldeliste, aufstellung: MixedAufstellung): Modifikator<MixedAufstellung> {
    return {
        hinzufuegen: (spieler: Spieler): MixedAufstellung => {
            const neueMaenner = meldeListe.meldeliste.maenner.includes(spieler) ? [...aufstellung.aufstellung.maenner, spieler] : aufstellung.aufstellung.maenner;
            const neueFrauen = meldeListe.meldeliste.frauen.includes(spieler) ? [...aufstellung.aufstellung.frauen, spieler] : aufstellung.aufstellung.frauen;
            return {
                aufstellung: {
                    maenner: neueMaenner,
                    frauen: neueFrauen
                },
            }
        },
        entfernen: (spieler: Spieler): MixedAufstellung => {
            const neueMaenner = aufstellung.aufstellung.maenner.filter(it => it !== spieler);
            const neueFrauen = aufstellung.aufstellung.frauen.filter(it => it !== spieler);
            return {
                aufstellung: {
                    maenner: neueMaenner,
                    frauen: neueFrauen
                }
            }
        }
    }
}

function normalModifikator(meldeListe: NormaleMeldeListe, aufstellung: NormaleAufstellung): Modifikator<NormaleAufstellung> {
    return {
        hinzufuegen: (spieler: Spieler): NormaleAufstellung => {
            const neueSpieler = meldeListe.meldeliste.includes(spieler) ? [...aufstellung.aufstellung, spieler] : aufstellung.aufstellung;
            return {
                aufstellung: neueSpieler
            }
        },
        entfernen: (spieler: Spieler): NormaleAufstellung => {
            const neueSpieler = aufstellung.aufstellung.filter(it => it !== spieler);
            return {
                aufstellung: neueSpieler
            }
        }
    }
}

function mixedNichtAufgestellteSpieler(meldeListe: MixedMeldeliste, aufstellung: MixedAufstellung): MixedNichtAufgestellteSpieler {
    return {
        nichtAufgestellteSpieler: {
            maenner: meldeListe.meldeliste.maenner.filter(it => !aufstellung.aufstellung.maenner.includes(it)),
            frauen: meldeListe.meldeliste.frauen.filter(it => !aufstellung.aufstellung.frauen.includes(it))
        }
    }
}

function normalNichtAufgestellteSpieler(meldeListe: NormaleMeldeListe, aufstellung: NormaleAufstellung): NormalNichtAufgestellteSpieler {
    return {
        nichtAufgestellteSpieler: meldeListe.meldeliste.filter(it => !aufstellung.aufstellung.includes(it))
    }
}

export const mixed6erRegel: AufstellungsRegel<MixedAufstellung> = (aufstellung: MixedAufstellung) => {
    if (aufstellung.aufstellung.maenner.length >= 3 && aufstellung.aufstellung.frauen.length >= 3) {
        return {validitaet: Validitaet.Valide};
    } else {
        return {validitaet: Validitaet.Invalide}
    }
}
export const normale6erRegel: AufstellungsRegel<NormaleAufstellung> = (aufstellung: NormaleAufstellung) => {
    if (aufstellung.aufstellung.length >= 6) {
        return {validitaet: Validitaet.Valide};
    } else {
        return {validitaet: Validitaet.Invalide}
    }
}

function validator<T extends Aufstellung>(regel: AufstellungsRegel<T>): Validator<T> {
    return (aufstellung: T) => {
        return {
            ...regel(aufstellung),
            ...aufstellung
        }
    }
}


export function initialMixed(meldeListe: MixedMeldeliste, regel: AufstellungsRegel<MixedAufstellung>): Mixed {
    const aufstellung: MixedAufstellung = {
        aufstellung: {
            maenner: [],
            frauen: []
        }
    }
    const f = validator<MixedAufstellung>(regel);

    const a = (i: MixedMeldeliste, j: MixedAufstellung): Modifikator<Mixed> => {
        const modi = mixedModifikator(i, j)
        return {
            hinzufuegen: (spieler: Spieler) => {
                const neueAufstellung = modi.hinzufuegen(spieler);
                return {...f(neueAufstellung), ...neueAufstellung, ...i, ...mixedNichtAufgestellteSpieler(i, neueAufstellung), ...a(i, neueAufstellung)};
            },
            entfernen: (spieler: Spieler) => {
                const neueAufstellung = modi.entfernen(spieler);
                return {...f(neueAufstellung), ...neueAufstellung, ...i, ...mixedNichtAufgestellteSpieler(i, neueAufstellung), ...a(i, neueAufstellung)};
            }
        }
    }
    return {
        validitaet: Validitaet.Invalide,
        ...aufstellung,
        ...meldeListe,
        ...a(meldeListe, aufstellung),
        ...mixedNichtAufgestellteSpieler(meldeListe, aufstellung),
        ...f
    }
}

export function initialNormal(meldeListe: NormaleMeldeListe, regel: AufstellungsRegel<NormaleAufstellung>): Normal {
    const aufstellung: NormaleAufstellung = {
        aufstellung: []
    }
    const f = validator<NormaleAufstellung>(regel);

    const a = (i: NormaleMeldeListe, j: NormaleAufstellung): Modifikator<Normal> => {
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