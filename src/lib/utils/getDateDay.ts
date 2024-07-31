export const getDateDay = () => {
  // 현재 날짜 가져오기
  const today = new Date();

  // 요일 배열
  const days = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];

  // 날짜 포맷팅
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, "0"); // 월은 0부터 시작하므로 1을 더하고 문자열로 변환 후 padStart 적용
  const date = today.getDate().toString().padStart(2, "0"); // 날짜를 문자열로 변환 후 padStart 적용
  const day = days[today.getDay()];

  // 포맷된 날짜 문자열 만들기
  const formattedDate = `${year}년 ${month}월 ${date}일 ${day}`;

  return formattedDate;
};
