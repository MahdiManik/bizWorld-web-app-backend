// utils/status.ts
export const getStatusStyles = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return {
        bgColor: 'bg-orange2',
        textColor: 'text-orange',
      };
    case 'accepted':
      return {
        bgColor: 'bg-green2',
        textColor: 'text-green',
      };
    case 'decline':
      return {
        bgColor: 'bg-red2',
        textColor: 'text-red',
      };
    default:
      return {
        bgColor: 'bg-orange2',
        textColor: 'text-orange',
      };
  }
};
