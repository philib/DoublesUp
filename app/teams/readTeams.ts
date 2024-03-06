import { PlayerId } from '../RegistrationList';
import { Id } from '../components/model/Id';
import { Teams } from './Teams';

export const readTeams = (teams: Teams) =>
  Object.entries(teams).map(([teamName, team]) => toInput(teamName, team));
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
