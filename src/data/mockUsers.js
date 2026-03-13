import { ROLES } from '../constants/roles';

export const MOCK_USERS = [
  {
    id: 'u1',
    email: 'teacher@example.com',
    name: 'Dr. Sarah Chen',
    role: ROLES.TEACHER,
    avatar: null,
  },
  {
    id: 'u2',
    email: 'student@example.com',
    name: 'Alex Johnson',
    role: ROLES.STUDENT,
    avatar: null,
  },
  {
    id: 'u3',
    email: 'admin@example.com',
    name: 'Admin User',
    role: ROLES.ADMIN,
    avatar: null,
  },
];
