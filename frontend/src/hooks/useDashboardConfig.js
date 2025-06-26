import roleMap from '../utils/roleMap';

export default function useDashboardConfig(role) {
  return roleMap[role] || [];
}
