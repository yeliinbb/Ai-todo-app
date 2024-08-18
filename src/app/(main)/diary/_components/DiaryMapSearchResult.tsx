import "react-spring-bottom-sheet/dist/style.css";
import { toast } from "react-toastify";
import { DiaryMapSearchMarkerType } from "@/types/diary.type";
import DiaryMapCloseBtn from "@/components/icons/diaries/DiaryMapCloseBtn";
import DiaryMapShortcutBtn from "@/components/icons/diaries/DiaryMapShortcutBtn";
import DiaryMapMoveToMyLocation from "@/components/icons/diaries/DiaryMapMoveToMyLocation";
import { BottomSheetRef } from "react-spring-bottom-sheet";
import { useCallback, useEffect, useRef, useState } from "react";
import CustomBottomSheet from "./CustomBottomSheet";

interface DiaryMapSearchResultProps {
  searchMarkers: DiaryMapSearchMarkerType[];
  handleUpdateAddress: (todoId: string, lat: number, lng: number) => void;
  todoId: string;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  getCurrentLocation: () => void;
  onMarkerSelect: (position: { lat: number; lng: number }) => void;
  setShowMarkerInfo: (index: number) => void;
  setSearchMarkers: (markers: DiaryMapSearchMarkerType[]) => void;
}

const DiaryMapSearchResult: React.FC<DiaryMapSearchResultProps> = ({
  searchMarkers,
  handleUpdateAddress,
  todoId,
  isVisible,
  setIsVisible,
  getCurrentLocation,
  onMarkerSelect,
  setShowMarkerInfo,
  setSearchMarkers
}) => {
  const sheetRef = useRef<BottomSheetRef | null>(null);
  const searchResultRef = useRef<HTMLUListElement | null>(null);
  const [isSheetReady, setIsSheetReady] = useState(false);

  useEffect(() => {
    if (sheetRef.current) {
      setIsSheetReady(true);
    }
  }, []);

  const snapToMinHeight = useCallback(() => {
    if (isSheetReady && sheetRef.current) {
      sheetRef.current.snapTo(({ snapPoints }) => snapPoints[2]);
    }
  }, [isSheetReady]);

  const snapPoints = useCallback(
    ({ maxHeight }: { maxHeight: number }) => ({
      full: maxHeight - 175,
      medium: maxHeight * 0.6,
      min: maxHeight / 4
    }),
    []
  );

  const handleMarkerClick = (marker: { lat: number; lng: number }, index: number) => {
    if (onMarkerSelect) {
      onMarkerSelect(marker);
    }
    const clickedMarker = searchMarkers[index];
    const updatedMarkers = [clickedMarker, ...searchMarkers.filter((_, i) => i !== index)];

    setSearchMarkers(updatedMarkers);

    const newIndex = updatedMarkers.findIndex((m) => m === clickedMarker);
    setShowMarkerInfo(newIndex);

    snapToMinHeight();
    if (searchResultRef.current) {
      searchResultRef.current.scrollTop = 0;
    }
  };

  return (
    <div>
      <CustomBottomSheet
        ref={sheetRef}
        open={isVisible}
        onDismiss={() => {
          setIsVisible(false);
          setSearchMarkers([]);
        }}
        snapPoints={({ maxHeight }) => [
          snapPoints({ maxHeight }).full,
          snapPoints({ maxHeight }).medium,
          snapPoints({ maxHeight }).min
        ]}
        defaultSnap={({ snapPoints }) => snapPoints[2]}
        blocking={false}
        expandOnContentDrag={false}
        className="bottom-sheet-main"
      >
        <div className="search-result w-[100%-1.5rem]">
          <DiaryMapMoveToMyLocation getCurrentLocation={getCurrentLocation} clasName={"absolute left-4 top-[-60px]"} />
          <div className="fixed top-6 left-0 right-0 flex justify-end px-3 cursor-pointer z-20">
            <DiaryMapCloseBtn setIsVisible={setIsVisible} setSearchMarkers={setSearchMarkers} />
          </div>
          <ul ref={searchResultRef} className="space-y-4 max-h-[500px] px-3 mt-2 overflow-y-scroll scrollbar-hide scroll-smooth">
            {searchMarkers.map((place, index) => (
              <li key={place.content + index} className="bg-white py-3.5 border-b border-gray-100">
                <div className=" bg-system-white text-green-800 z-50 mx-auto">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col gap-1 w-[calc(100%-2.5rem)]">
                      <p className="font-bold text-xl leading-7 tracking-custom-letter-spacing text-gray-900 h-7">
                        {place.content}
                      </p>
                      <p className="font-medium text-sm h-6 leading-6 tracking-custom-letter-spacing text-[#8B929A] truncate text-ellipsis">
                        주소: {place.roadAddress}
                      </p>
                    </div>
                    <button
                      className="h-14 flex flex-col items-center justify-center w-8"
                      onClick={() => {
                        handleMarkerClick(place.position, index);
                      }}
                    >
                      <DiaryMapShortcutBtn />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      toast.success(`검색 결과의 위치를 추가 완료`);
                      handleUpdateAddress(todoId, place.position.lat, place.position.lng);
                    }}
                    className="mt-2 px-4 bg-pai-300 text-system-white hover:bg-fai-200 rounded-full text-xs leading-6 font-medium tracking-custom-letter-spacing"
                  >
                    장소 선택
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CustomBottomSheet>
    </div>
  );
};

export default DiaryMapSearchResult;
