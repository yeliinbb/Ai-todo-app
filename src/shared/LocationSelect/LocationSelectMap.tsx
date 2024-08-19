import { useCallback, useEffect, useState } from "react";
import { CustomOverlayMap, Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { Coord, LocationData } from "./types";
import { coordToLocation } from "./api";
import MarkerIcon from "./MarkerIcon";
import { Button } from "../ui/button";

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
      mapInstance?.setCenter(latlng);
      const locationData = await coordToLocation({ lat: latlng.getLat(), lng: latlng.getLng() });
      setCurrentLocation(locationData);
    },
    [mapInstance]
  );

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
          <MarkerIcon className="-translate-y-[45%]" />
        </CustomOverlayMap>
      )}
      {currentLocation && (
        <CustomOverlayMap clickable position={currentLocation.coord} zIndex={2}>
          <MarkerIcon className="-translate-y-[45%]" />
          <div className="absolute left-[50%] top-[0] -translate-x-[50%] -translate-y-[120%]  bg-system-white border-b z-[2] flex flex-col p-4 rounded-2xl border border-pai-200">
            <h3>{currentLocation.placeName}</h3>
            <span>{currentLocation.roadAddress ?? currentLocation.address}</span>
            <Button onClick={() => onSelect?.(currentLocation)}>선택하기</Button>
          </div>
        </CustomOverlayMap>
      )}
    </Map>
  );
};

export default LocationSelectMap;
