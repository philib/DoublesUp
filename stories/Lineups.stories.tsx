import { LineupsComponent } from '../app/Lineups/Lineups';
import { createFakeUseService } from './useFakeService';

const meta = {
  title: 'Lineups',
  component: LineupsComponent,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof LineupsComponent>;

export default meta;

const useFakeService = createFakeUseService(20);

export const Default = () => {
  const service = useFakeService();
  const players = service.players.slice(0, 6).map((p) => p.id);

  return (
    <>
      <LineupsComponent
        lineups={[
          {
            activePlayers: [
              { name: '1' },
              { name: '2' },
              { name: '3' },
              { name: '4' },
              { name: '5' },
              { name: '6' },
            ],
            inactivePlayers: [{ name: '7' }],
            variations: [
              [
                [
                  { position: 1, name: '1' },
                  { position: 2, name: '2' },
                ],
                [
                  { position: 3, name: '3' },
                  { position: 4, name: '4' },
                ],
                [
                  { position: 5, name: '5' },
                  { position: 6, name: '6' },
                ],
              ],
              [
                [
                  { position: 1, name: '1' },
                  { position: 3, name: '3' },
                ],
                [
                  { position: 2, name: '2' },
                  { position: 4, name: '4' },
                ],
                [
                  { position: 5, name: '5' },
                  { position: 6, name: '6' },
                ],
              ],
            ],
          },
          {
            activePlayers: [
              { name: '1' },
              { name: '2' },
              { name: '3' },
              { name: '4' },
              { name: '5' },
              { name: '7' },
            ],
            inactivePlayers: [{ name: '6' }],
            variations: [
              [
                [
                  { position: 1, name: '1' },
                  { position: 2, name: '2' },
                ],
                [
                  { position: 3, name: '3' },
                  { position: 4, name: '4' },
                ],
                [
                  { position: 5, name: '5' },
                  { position: 6, name: '7' },
                ],
              ],
              [
                [
                  { position: 1, name: '1' },
                  { position: 3, name: '3' },
                ],
                [
                  { position: 2, name: '2' },
                  { position: 4, name: '4' },
                ],
                [
                  { position: 5, name: '5' },
                  { position: 6, name: '7' },
                ],
              ],
            ],
          },
        ]}
      />
    </>
  );
};
