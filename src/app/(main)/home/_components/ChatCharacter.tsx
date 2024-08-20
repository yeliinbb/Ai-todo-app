import Image from "next/image";

interface ChatCharacterProps {
  isFai?: boolean;
}

const ChatCharacter = ({ isFai }: ChatCharacterProps) => {
  const imgSrc = isFai ? "/homeFAi.png" : "/homePAi.png";
  const altText = isFai ? "FAi" : "PAi";

  return (
    <div className="relative w-[60px] h-[60px] min-w-[60px] min-h-[60px] max-w-[160px] max-h-[160px] desktop:w-[160px] desktop:h-[160px] sm:w-[80px] sm:h-[80px] md:w-[100px] md:h-[100px] lg:w-[120px] lg:h-[120px]">
      <Image
        src={imgSrc}
        alt={altText}
        fill
        priority
        sizes="(max-width: 639px) 60px, (max-width: 767px) 80px, (max-width: 1023px) 100px, (max-width: 1199px) 120px, 160px"
        className="object-contain"
      />
    </div>
  );
};

export default ChatCharacter;
