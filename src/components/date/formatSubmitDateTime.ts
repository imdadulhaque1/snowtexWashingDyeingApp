export const formatSubmitDateTime = (timestamp: any) => {
  const date = new Date(timestamp);

  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;

  const formattedTime = `${hours}:${
    minutes < 10 ? '0' + minutes : minutes
  } ${ampm}`;

  return `${formattedDate} ${formattedTime}`;
};
