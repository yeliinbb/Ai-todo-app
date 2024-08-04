export const getDateYear = (dateString: string) => {
  const date = new Date(dateString);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();

  return `${year}년 ${month}월 ${day}일`;
};
