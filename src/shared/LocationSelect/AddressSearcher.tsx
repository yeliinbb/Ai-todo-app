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
        className="flex-1"
        onChange={(e) => setSearchKeyword(e.target.value)}
        onKeyDown={(e) => {
          console.log(e);
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
      />
      <Drawer open={drawerState.visible} onClose={handleClose} handleOnly modal={false}>
        <DrawerPortal>
          <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[calc(100svh-77px)] flex-col rounded-t-[48px] border bg-background">
            <DrawerHeader className="relative">
              <DrawerHandle className="mx-auto mt-4 h-2 w-[100px] rounded-full bg-muted" />
              <DrawerTitle className="hidden">장소 선택</DrawerTitle>
              <DrawerCloseButton onClick={handleClose} />
            </DrawerHeader>
            {currentDetail ? (
              <div className="flex flex-col p-2">
                <h4 className="m-0">{currentDetail.placeName}</h4>
                <span>도로명 주소 : {currentDetail.roadAddress}</span>
                <span>지번 주소 : {currentDetail.address}</span>
                <span>전화 번호 : {currentDetail.phone}</span>
                <div className="flex justify-end">
                  <Button onClick={() => handleClickSelect(currentDetail)}>장소 선택</Button>
                </div>
              </div>
            ) : (
              <ScrollArea className="flex flex-col flex-1">
                {places?.map((place) => (
                  <div
                    className="flex p-2 border-b border-b-gray-200 cursor-pointer"
                    key={place.id}
                    onClick={() => handleClickDetail(place)}
                  >
                    <div className="flex flex-col gap-1 flex-1">
                      <h4 className="m-0">{place.placeName}</h4>
                      <span className="text-gray-400 text-ellipsis">주소 : {place.roadAddress ?? place.address}</span>
                      <Button onClick={() => handleClickSelect(place)}>장소선택</Button>
                    </div>
                    <span className="text-pai-300">
                      <FaChevronRight />
                    </span>
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
