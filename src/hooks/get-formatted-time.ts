export const useGetFormattedTime = (dateInMilliseconds: number) => {
  const formattedDate = new Date(dateInMilliseconds);

  const date = formattedDate.getDate();

  const month =
    formattedDate.getMonth() + 1 < 10
      ? `0${formattedDate.getMonth() + 1}`
      : formattedDate.getMonth() + 1;

  const year = formattedDate.getFullYear();

  const time = formattedDate.toLocaleTimeString();

  const timeArray = time.split(" ");

  timeArray[0] = timeArray[0].slice(0, -3);

  const formattedTime = timeArray.join("");

  return { date, month, year, formattedTime };
};
