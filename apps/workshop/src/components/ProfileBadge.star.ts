import ProfileBadge from './ProfileBadge.astro';

export default {
  component: ProfileBadge,
  constellation: 'components/users/main',
  title: 'Profile Badge',
};

export const Default = {
  args: {
    name: 'Ada Lovelace',
    role: 'Admin',
  },
};

export const Active = {
  args: {
    name: 'Grace Hopper',
    role: 'Owner',
    active: true,
  },
};
