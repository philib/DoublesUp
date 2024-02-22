import { Meta } from '@storybook/react';
import { Navigator } from '../app/Navigator/Navigator';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import React from 'react';
import { PlayerId, RegistrationList } from '../app/RegistrationList';
import { Meldeliste } from '../app/Meldeliste/Meldeliste';
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
    show: () => true,
    title: 'Registration List',
    icon: AccountCircleIcon,
    component: (
      <CenteredDivContent height="900px">Registration List</CenteredDivContent>
    ),
  };

  const matchMaking = {
    show: () => true,
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
    show: () => true,
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
        selectPlayer={function (id: PlayerId): void {}}
        deselectPlayer={function (id: PlayerId): void {}}
        isPlayerSelected={function (id: PlayerId): boolean {
          return false;
        }}
      />
    ),
  };

  return <Navigator navigations={[registrationList]} />;
};
