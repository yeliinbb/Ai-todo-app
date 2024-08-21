import { useCallback, useEffect, useState } from "react";
import { CustomOverlayMap, Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { Coord, LocationData } from "./types";
import { coordToLocation } from "./api";
import MarkerIcon from "./MarkerIcon";
import { Button } from "../ui/button";
import { LocateIcon } from "lucide-react";

interface LocationSelectMapProps {
  className?: string;
  center?: Coord;
  onSelect?: (data: LocationData) => void;
}

const defaultCenter: Coord = { lat: 37.50235231, lng: 127.04444741 };

const LocationSelectMap = ({ className, center, onSelect }: LocationSelectMapProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
    libraries: ["services"]
  });
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LocationData | undefined>();

  const handleCreate = useCallback((instance: kakao.maps.Map) => {
    setMapInstance(instance);
  }, []);

  const handleClick = useCallback(
    async (latlng: kakao.maps.LatLng) => {
      // mapInstance?.setCenter(latlng);
      const locationData = await coordToLocation({ lat: latlng.getLat(), lng: latlng.getLng() });
      setCurrentLocation(locationData);
    },
    [mapInstance]
  );

  // 현재 위치로 마커를 이동시키는 함수
  const centerMapOnMarker = useCallback(
    (position: { lat: number; lng: number }) => {
      if (mapInstance) {
        const newLatLng = new kakao.maps.LatLng(position.lat, position.lng);
        mapInstance.panTo(newLatLng);
        handleClick(newLatLng); // 새로운 위치로 이동한 후 해당 위치 정보를 가져옴
      }
    },
    [mapInstance, handleClick]
  );

  // 현재 위치를 가져와서 마커를 그 위치로 이동시키는 함수
  const moveToCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        centerMapOnMarker({ lat: latitude, lng: longitude });
      });
    }
  }, [centerMapOnMarker]);

  useEffect(() => {
    if (center) {
      setCurrentLocation(undefined);
      mapInstance?.setCenter(new kakao.maps.LatLng(center.lat, center.lng));
    }
  }, [center, mapInstance]);

  return (
    <Map // 지도를 표시할 Container
      id="location-select-map"
      center={center ?? defaultCenter}
      className={className}
      level={3} // 지도의 확대 레벨
      draggable={true}
      disableDoubleClick={true}
      onCreate={handleCreate}
      onClick={(_, mouseEvent) => {
        const latlng = mouseEvent.latLng;
        handleClick(latlng);
      }}
    >
      {center && currentLocation === undefined && (
        <CustomOverlayMap clickable position={center} zIndex={2}>
          <MarkerIcon className="-translate-y-[45%] text-system-red" />
        </CustomOverlayMap>
      )}
      {currentLocation && (
        <CustomOverlayMap clickable position={currentLocation.coord} zIndex={2}>
          <MarkerIcon className="-translate-y-[45%]" />
          <div className="absolute left-[50%] top-[0] -translate-x-[50%] -translate-y-[120%] flex flex-col gap-[0.75rem] items-start w-[19.25rem] px-[1.25rem] py-[1rem] bg-system-white rounded-[2rem] border border-pai-300 border-b z-[2]">
            <div>
              <h3 className="m-0 text-sh4 text-gray-800 overflow-hidden">{currentLocation.placeName}</h3>
              <span className="text-bc5 text-gray-600 overflow-hidden truncate">
                {currentLocation.roadAddress ?? currentLocation.address}
              </span>
            </div>
            <div className="flex justify-end items-end gap-[0.75rem] self-stretch">
              <Button
                className="typo-bc6 h-[2rem] px-[1.2rem] py-[0.35rem] rounded-[1.5rem] bg-pai-300 hover:bg-pai-300 hover:border-pai-400 active:bg-pai-400"
                onClick={() => onSelect?.(currentLocation)}
              >
                장소 선택하기
              </Button>
            </div>
          </div>
        </CustomOverlayMap>
      )}
      {/* 현재 위치로 이동하는 버튼 */}
      <div className="absolute bottom-4 left-0 z-[1000] p-[1rem]">
        <Button
          className="bg-system-white shadow-lg w-[2.875rem] h-[2.875rem] p-[0.75rem]"
          variant={"grayScale"}
          onClick={moveToCurrentLocation}
        >
          <LocateIcon className="text-gray-900" />
        </Button>
      </div>
    </Map>
  );
};

export default LocationSelectMap;
