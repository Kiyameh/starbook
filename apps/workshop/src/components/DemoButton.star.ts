import DemoButton from './DemoButton.astro';

export default {
  component: DemoButton,
  constellation: 'components/forms/main',
  title: 'Demo Button',
};

export const Default = {
  args: {
    label: 'Save',
    variant: 'primary',
  },
};

export const Disabled = {
  args: {
    label: 'Save',
    variant: 'primary',
    disabled: true,
  },
};

export const Secondary = {
  args: {
    label: 'Cancel',
    variant: 'secondary',
  },
};
