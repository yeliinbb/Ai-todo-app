import { useCallback, useState } from "react";
import { Input } from "../ui/input";
import { searchPlacesByKeyword } from "./api";
import { LocationData, Place } from "./types";
import {
  Drawer,
  DrawerCloseButton,
  DrawerHandle,
  DrawerHeader,
  DrawerPortal,
  DrawerPrimitive,
  DrawerTitle
} from "../ui/drawer";
import useModalState from "@/hooks/useModalState";
import { Button } from "../ui/button";
import { FaChevronRight } from "react-icons/fa";
import { ScrollArea } from "../ui/scroll-area";
import SearchButton from "@/components/search/SearchButton";
import { SearchIcon } from "lucide-react";
import { cn } from "../utils";

interface AddressSearcherProps {
  onSelect: (data: LocationData) => void;
  onClickDetail: (data: LocationData) => void;
}

export default function AddressSearcher({ onSelect, onClickDetail }: AddressSearcherProps) {
  const [searchKeyword, setSearchKeyword] = useState<string>();
  const drawerState = useModalState();
  const [places, setPlaces] = useState<Place[]>();
  const [currentDetail, setCurrentDetail] = useState<Place>();

  const handleSearch = useCallback(async () => {
    if (!searchKeyword) {
      return;
    }
    const places = await searchPlacesByKeyword(searchKeyword);
    setPlaces(places);
    setCurrentDetail(undefined);
    drawerState.open();
  }, [searchKeyword, drawerState]);

  const handleClose = useCallback(() => {
    drawerState.close();

    // Drawer 닫히는 transition 동안 하위 element들이 사라지면 갑자기 훅 꺼지므로, 딜레이 후 하위 노드들을 삭제하도록 한다.
    setTimeout(() => {
      setPlaces([]);
      setCurrentDetail(undefined);
    }, 500);
  }, [drawerState]);

  const handleClickDetail = useCallback(
    (place: Place) => {
      onClickDetail(placeToLocationData(place));
      setCurrentDetail(place);
    },
    [onClickDetail]
  );

  const handleClickSelect = useCallback(
    (place: Place) => {
      onSelect(placeToLocationData(place));
      handleClose();
    },
    [onSelect, handleClose]
  );

  return (
    <>
      <Input
        className="flex flex-1 gap-[0.125rem] self-stretch items-center px-[1.25rem] py-[0.62rem] rounded-full text-bc6 text-gray-500 border border-gray-500"
        placeholder="검색어를 입력하세요"
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Button onClick={handleSearch} variant={"linedGrayScale"} className="bg-system-white w-9 h-9 p-2">
        <SearchIcon className="text-gray-500 hover:text-system-white active:text-system-white" />
      </Button>
      <Drawer direction="right" open={drawerState.visible} onClose={handleClose} handleOnly modal={false}>
        <DrawerPortal>
          <DrawerPrimitive.Content
            className={cn(
              "fixed inset-x-0 bottom-0 z-50 flex max-h-[60svh] flex-col rounded-t-[48px] border bg-background",
              "desktop:desktop:left-auto desktop:right-0 desktop:w-[30vw] desktop:duration-300 desktop:east-in-out"
            )}
          >
            <DrawerHeader className="relative">
              <DrawerHandle className="mx-auto h-2 w-[100px] rounded-full bg-muted" />
              {/* <DrawerTitle className="hidden">장소 선택</DrawerTitle> */}
              <DrawerCloseButton onClick={handleClose} className="mt-4" />
            </DrawerHeader>
            {currentDetail ? (
              <div className="flex flex-col items-start gap-[0.5rem] px-[1rem] py-[1.25rem]">
                <h4 className="m-0 text-sh4 text-gray-800 overflow-hidden">{currentDetail.placeName}</h4>
                <span className="text-bc5 text-gray-600 overflow-hidden truncate">{currentDetail.roadAddress}</span>
                <span className="text-bc5 text-gray-600 overflow-hidden truncate">{currentDetail.phone}</span>
                <div className="flex justify-end items-end gap-[0.75rem] self-stretch">
                  <Button
                    className="typo-bc6 h-[2rem] px-[1.2rem] py-[0.35rem] rounded-[1.5rem] bg-pai-300 hover:bg-pai-300 hover:border-pai-400 active:bg-pai-400"
                    onClick={() => handleClickSelect(currentDetail)}
                  >
                    장소 선택하기
                  </Button>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex flex-col flex-1 mt-4">
                {places?.map((place) => (
                  <div
                    className="flex flex-col px-[1rem] py-[0.88rem] border-b border-b-gray-100 cursor-pointer"
                    key={place.id}
                    onClick={() => handleClickDetail(place)}
                  >
                    <div className="flex items-start gap-[0.5rem] self-stretch">
                      <div className="flex flex-col items-start gap-[0.25rem] flex-1">
                        <h4 className="m-0 text-sh4 text-gray-800 overflow-hidden">{place.placeName}</h4>
                        <span className="text-bc5 text-gray-600 overflow-hidden truncate">
                          {place.roadAddress ?? place.address}
                        </span>
                      </div>
                      <span className="flex justify-center items-center gap-[0.125rem] self-stretch p-[0.5rem] pb-[1rem] text-gray-700">
                        <FaChevronRight />
                      </span>
                    </div>
                    <div className="flex justify-end items-end gap-[0.75rem] self-stretch">
                      <Button
                        className="typo-bc6 h-[2rem] px-[1.2rem] py-[0.35rem] rounded-[1.5rem] bg-pai-300 hover:bg-pai-300 hover:border-pai-400 active:bg-pai-400"
                        onClick={() => handleClickSelect(place)}
                      >
                        장소 선택
                      </Button>
                    </div>
                  </div>
                ))}
              </ScrollArea>
            )}
          </DrawerPrimitive.Content>
        </DrawerPortal>
      </Drawer>
    </>
  );
}

function placeToLocationData(place: Place): LocationData {
  return {
    address: place.address,
    roadAddress: place.roadAddress,
    coord: place.coord,
    placeName: place.placeName
  };
}
