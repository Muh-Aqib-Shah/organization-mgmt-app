export const getOrgMeta = (type: 'school' | 'business' | 'nonprofit') => {
  switch (type) {
    case 'school':
      return {
        color: 'bg-gradient-to-br from-red-500 to-red-600',
        icon: '🎓',
      };

    case 'business':
      return {
        color: 'bg-gradient-to-br from-blue-500 to-blue-600',
        icon: '🏢',
      };

    case 'nonprofit':
      return {
        color: 'bg-gradient-to-br from-green-500 to-green-600',
        icon: '🌱',
      };

    default:
      return {
        color: 'bg-slate-500',
        icon: '🏢',
      };
  }
};
