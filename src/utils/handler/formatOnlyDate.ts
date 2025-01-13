export const formatOnlyDate = (timestamp: any) => {
  const date = new Date(timestamp);

  const formattedDate = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  let hours = date.getHours();
  hours = hours % 12;
  hours = hours ? hours : 12;

  return `${formattedDate}`;
};
