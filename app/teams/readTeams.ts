import { PlayerId } from '../logic/RegistrationList';
import { Team } from '../components/StaticRegistrationList/StaticRegistrationList';
import { Id } from '../components/model/Id';
import { RegistrationList, Teams } from './Teams';

const getSize = (key: any): 4 | 6 => {
  const number = Number(key);
  if (number === 4) {
    return 4;
  } else if (number === 6) {
    return 6;
  } else {
    throw new Error(`Invalid size ${key}`);
  }
};
export const readTeams = (teams: Teams): Team[] =>
  Object.entries(teams).flatMap(([size, t]) =>
    Object.entries(t as { [teamName: string]: RegistrationList }).map(
      ([teamName, team]: [string, RegistrationList]) =>
        toInput(getSize(size), teamName, team)
    )
  );
const toInput = (size: 4 | 6, teamName: string, list: RegistrationList): Team =>
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
      size: size,
      name: teamName,
      registrationList: {},
    }
  );
