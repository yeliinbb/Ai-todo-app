import Image from "next/image";

interface ChatCharacterProps {
  isFai?: boolean;
}

const ChatCharacter = ({ isFai }: ChatCharacterProps) => {
  const imgSrc = isFai ? "/homeFAi.png" : "/homePAi.png";
  return (
    <div>
      {/* 모바일 */}
      <Image
        src={imgSrc}
        width={60}
        height={60}
        alt="PAi"
        priority
        sizes="(max-width: 1200px) 60px"
        className="block desktop:hidden"
      />
      {/* 데스크탑 */}
      <Image src={imgSrc} width={160} height={160} alt="PAi" priority className="hidden desktop:block" />
    </div>
  );
};

export default ChatCharacter;
