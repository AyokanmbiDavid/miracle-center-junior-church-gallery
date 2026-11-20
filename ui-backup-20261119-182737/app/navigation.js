import {
  House,
  Users,
  Crown,
  Clock3,
  Images,
  LayoutDashboard,
  UserRoundCog,
  Award,
  CalendarDays,
  GalleryVertical,
  Settings
} from 'lucide-react';

export const navigation = [
  {
    title: 'PUBLIC PAGES',
    items: [
      { label: 'Home', path: '/', icon: House },
      { label: 'Members Registry', path: '/members', icon: Users },
      { label: 'Exco Leadership', path: '/exco', icon: Crown },
      { label: 'Status Updates', path: '/status', icon: Clock3 },
      { label: 'Throwback Gallery', path: '/throwbacks', icon: Images }
    ]
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { label: 'Overview', path: '/admin', icon: LayoutDashboard },
      { label: 'Manage Members', path: '/admin/members', icon: UserRoundCog },
      { label: 'Exco Management', path: '/admin/exco', icon: Award },
      { label: 'Status Management', path: '/admin/status', icon: CalendarDays },
      { label: 'Gallery Management', path: '/admin/throwbacks', icon: GalleryVertical },
      { label: 'Settings', path: '/admin/settings', icon: Settings }
    ]
  }
];
