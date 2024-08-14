export const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const koreaTime = new Date(date.toLocaleString("en-US", { timeZone: "Asia/Seoul" }));

  let hours = koreaTime.getHours();
  const minutes = koreaTime.getMinutes();

  // 12시간 형식으로 변환
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes.toString().padStart(2, "0");

  return `${formattedHours}:${formattedMinutes}`;
};
