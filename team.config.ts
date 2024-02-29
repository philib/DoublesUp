import { PlayerId } from './app/RegistrationList';
import { Id } from './app/components/model/Id';

const toInput = (teamName: string, list: { [key: number]: string }) =>
  Object.entries(list).reduce(
    (acc, [key, value]) => ({
      ...acc,
      registrationList: {
        ...acc.registrationList,
        [key]: { id: PlayerId.random(), name: value },
      },
    }),
    {
      id: { type: 'Team' as const, id: Id.random() },
      name: teamName,
      registrationList: {},
    }
  );

const teams = {
  'Herren 30': {
    1: 'Michael Ruhr',
    2: 'Tobias Kominek',
    3: 'Michael Frank',
    4: 'Tobias Kaul',
    5: 'Klaus Rauch',
    6: 'Dominik Walter',
    7: 'Lars Rommel',
    8: 'Christian Frank',
    9: 'Jörg Kühnle',
    10: 'Frederik Vogel',
    11: 'Thorsten Väth',
    12: 'Lars Lipp',
    13: 'Michael Weiser',
    14: 'Philip Schäfer',
    15: 'Andreas Metzner',
  },
  'Herren 40': {
    1: 'Tobias Kaul',
    2: 'Klaus Rauch',
    3: 'Dominik Walter',
    4: 'Lars Rommel',
    5: 'Christian Frank',
    6: 'Thorsten Väth',
    7: 'Michael Weiser',
    8: 'Thorsten Weick',
    9: 'Mathias Lauterbach',
    10: 'Michael Rady',
    11: 'Armin Schnepf',
    12: 'Gabriel Hurst',
  },
  'Damen 40': {
    1: 'Tamara Traub',
    2: 'Bianca Hurst',
    3: 'Isabell Esslinger',
    4: 'Jutta Mast',
    5: 'Beate Walter',
    6: 'Christel Köppel-Jung',
    7: 'Maja Ullrich',
    8: 'Corinna Kaul',
    9: 'Rita Withum',
    10: 'Bettina Weingartner',
    11: 'Christine Ulrich',
    12: 'Ilona Zehe',
    13: 'Iris Hauns',
    14: 'Andrea Jelinko',
    15: 'Christiane Leppert',
  },
  Mixed: {
    1: 'Michael Ruhr',
    2: 'Jakob Amann',
    3: 'Tobias Kominek',
    4: 'Michael Frank',
    5: 'Tobias Kaul',
    6: 'Dominik Walter',
    7: 'Lars Rommel',
    8: 'Christian Frank',
    9: 'Jörg Kühnle',
    10: 'Frederik Vogel',
    11: 'Thorsten Väth',
    12: 'Lars Lipp',
    13: 'Michael Weiser',
    14: 'Philip Schäfer',
    15: 'Andreas Metzner',
  },
};

export const teamConfig = {
  teams: Object.entries(teams).map(([teamName, team]) =>
    toInput(teamName, team)
  ),
};
