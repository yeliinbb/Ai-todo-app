const ChatSkeleton = () => {
  return (
    <div className="animate-pulse">
      <ul>
        {Array.from({ length: 4 }).map((_, index) => {
          return (
            <li className={`mb-4 flex flex-col ${index % 2 == 0 ? "items-start" : "items-end"}`} key={index}>
              <div className="bg-gray-200 rounded-full h-5 w-12 mb-2"></div>
              <div className="bg-gray-200 rounded-3xl w-full p-2 h-20">{/* 채팅 박스 */}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatSkeleton;
