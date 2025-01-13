export const formatDate = (timestamp: any) => {
  const date = new Date(timestamp);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes();

  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const ordinalSuffix = (n: string | number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  const formattedDay = ordinalSuffix(day);
  const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return `${formattedDay} ${month} ${year}`;
  // return `${formattedDay} ${month} ${year}, ${hours}:${formattedMinutes} ${ampm}`;
};

export const formatDateTime = (date: any) => {
  return `${date.toLocaleDateString('en-US')} ${date.toLocaleTimeString(
    'en-US',
    {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    },
  )}`;
};

export const secondsToHms = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  return `${hours} H : ${minutes} M`;
};

export const calculateDate = (getDate: any) => {
  const stripTime = (date: Date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  return stripTime(new Date(getDate));
};
