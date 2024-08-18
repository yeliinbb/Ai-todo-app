import { motion } from "framer-motion";

interface AiModeToggleSegmentProps {
  isFai: boolean;
  handleToggleAiMode: () => void;
}

const AiModeToggleSegment = ({ isFai, handleToggleAiMode }: AiModeToggleSegmentProps) => {
  return (
    <div className="w-full bg-gray-100 p-1 flex justify-between items-center rounded-full relative min-h-11">
      <div className="absolute inset-1 flex">
        <motion.div
          className={`absolute  w-1/2 h-full rounded-full ${isFai ? "bg-fai-500" : "bg-pai-400"}`}
          animate={{ x: isFai ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      </div>
      <div className="relative z-10 flex w-full">
        <div
          onClick={handleToggleAiMode}
          className={`flex-1 rounded-full text-center text-h6 desktop:text-h5 z-10 cursor-pointer min-h-6 ${
            isFai ? "text-gray-700" : "text-system-white"
          }`}
        >
          PAi
        </div>
        <div
          onClick={handleToggleAiMode}
          className={`flex-1 text-center text-h6 desktop:text-h5 z-10 cursor-pointer min-h-6 ${
            isFai ? "text-system-white" : "text-gray-700"
          }`}
        >
          FAi
        </div>
      </div>
    </div>
  );
};

export default AiModeToggleSegment;
