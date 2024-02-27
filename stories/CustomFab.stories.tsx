import { CustomFab } from '../app/components/CustomFab';
import AddIcon from '@mui/icons-material/Add';
import { Meta } from '@storybook/react';

const meta = {
  title: 'CustomFab',
  component: CustomFab,
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/configure/story-layout
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CustomFab>;

export default meta;

export const Default = () => {
  return (
    <div style={{ height: '100vh' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
        }}
      >
        <CustomFab onClick={() => {}}>
          <AddIcon />
        </CustomFab>
        <div
          style={{
            backgroundColor: 'red',
            width: '100%',
            height: '200px',
          }}
        />
      </div>
    </div>
  );
};
