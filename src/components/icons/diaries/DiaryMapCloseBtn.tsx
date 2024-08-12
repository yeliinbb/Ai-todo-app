import { DiaryMapSearchMarkerType } from "@/types/diary.type";

const DiaryMapCloseBtn = ({
  setIsVisible,
  setSearchMarkers
}: {
  setIsVisible: (visible: boolean) => void;
  setSearchMarkers: (markers: DiaryMapSearchMarkerType[]) => void;
}) => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-gray-400"
      onClick={() => {
        setIsVisible(false);
        setSearchMarkers([]);
      }}
    >
      <rect x="0.5" y="0.5" width="31" height="31" rx="15.5" stroke="#A5A4A7" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M21.5896 11.5891C21.915 11.2637 21.915 10.736 21.5896 10.4106C21.2641 10.0851 20.7365 10.0851 20.4111 10.4106L16.0003 14.8213L11.5896 10.4106C11.2641 10.0851 10.7365 10.0851 10.4111 10.4106C10.0856 10.736 10.0856 11.2637 10.4111 11.5891L14.8218 15.9998L10.4111 20.4106C10.0856 20.736 10.0856 21.2637 10.4111 21.5891C10.7365 21.9145 11.2641 21.9145 11.5896 21.5891L16.0003 17.1783L20.4111 21.5891C20.7365 21.9145 21.2641 21.9145 21.5896 21.5891C21.915 21.2637 21.915 20.736 21.5896 20.4106L17.1788 15.9998L21.5896 11.5891Z"
        fill="currentColor"
      />
    </svg>
  );
};

export default DiaryMapCloseBtn;
