import { Meta } from '@storybook/react';
import { Navigator } from '../app/Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import { PlayerId, RegistrationList } from '../app/RegistrationList';
import { Meldeliste } from '../app/Meldeliste/Meldeliste';
import { createUseService } from '../app/service/useRegistrationListServiceFactory';
import { RegistrationListRepositoryFake } from '../test/service/RegistrationListRepositoryFake';
import { createFakeUseService } from './useFakeService';
const meta = {
  title: 'Navigator',
  component: Navigator,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof Navigator>;

export default meta;

export const Default = () => {
  const CenteredDivContent: React.FunctionComponent<{
    children: React.ReactNode;
    height?: string;
  }> = ({ children, height = '100%' }) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height,
      }}
    >
      {children}
    </div>
  );
  const registrationList = {
    title: 'Registration List',
    icon: AccountCircleIcon,
    component: (
      <CenteredDivContent height="900px">Registration List</CenteredDivContent>
    ),
  };

  const matchMaking = {
    title: 'Match Making',
    icon: AccountCircleIcon,
    component: <CenteredDivContent>Match Making</CenteredDivContent>,
  };

  return <Navigator navigations={[registrationList, matchMaking]} />;
};
const useFakeService = createFakeUseService(20);
export const WithRegistrationList = () => {
  const service = useFakeService();
  const registrationList = {
    title: 'Registration List',
    icon: AccountCircleIcon,
    component: (
      <Meldeliste
        players={service.players}
        addPlayer={() => {}}
        deletePlayer={() => {}}
        editPlayer={() => 'SUCCESS'}
        sortPlayer={(rankFrom, rankTo) => service.sortPlayer(rankFrom, rankTo)}
        onPlayerListModified={() => {}}
      />
    ),
  };

  return <Navigator navigations={[registrationList]} />;
};
