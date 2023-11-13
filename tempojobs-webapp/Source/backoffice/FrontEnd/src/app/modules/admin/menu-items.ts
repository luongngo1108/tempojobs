import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'shopping-cart-outline',
    link: '/admin/dashboard',
    home: true,
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Users',
    icon: 'person-outline',
    link: '/admin/user',
    home: true,
  },
  {
    title: 'DataStates',
    icon: 'bookmark-outline',
    link: '/admin/datastate',
  },
  {
    title: 'Reports',
    icon: 'alert-triangle-outline',
    link: '/admin/report',
  },
  {
    title: 'Works',
    icon: 'briefcase-outline',
    link: '/admin/work',
  },
];
