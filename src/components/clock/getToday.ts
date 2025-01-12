const getToday = () => {
  let d: Date = new Date();

  let month = String(d.getMonth() + 1);
  let day = String(d.getDate());
  const year = String(d.getFullYear());

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  const today = `${month}-${day}-${year}`;
  return today;
};
export default getToday;
