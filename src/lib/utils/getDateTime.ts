export const getDateTime = (dateString: string) => {
  // Date 객체로 변환
  const date = new Date(dateString);

  // 연도, 월, 일, 시간, 분, 초를 추출
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  const hours = String(date.getUTCHours()).padStart(2, "0");
  const minutes = String(date.getUTCMinutes()).padStart(2, "0");
  const seconds = String(date.getUTCSeconds()).padStart(2, "0");

  // 원하는 형식으로 반환
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};
