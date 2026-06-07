export const getRoleMeta = (type: 'owner' | 'admin' | 'member') => {
  switch (type) {
    case 'owner':
      return {
        roleStyle: 'bg-purple-50 text-purple-700 hover:bg-purple-50',
        statusColor: 'bg-green-500 text-green-700 bg-green-50',
      };

    case 'admin':
      return {
        roleStyle: 'bg-blue-50 text-blue-700 hover:bg-blue-50',
        statusColor: 'bg-green-500 text-green-700 bg-green-50',
      };

    case 'member':
      return {
        roleStyle: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
        statusColor: 'bg-green-500 text-green-700 bg-green-50'
      };

    default:
      return {
        roleStyle: 'bg-slate-100 text-slate-700 hover:bg-slate-100',
        statusColor: 'bg-green-500 text-green-700 bg-green-50'
      };
  }
};
