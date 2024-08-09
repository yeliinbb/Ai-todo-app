import { useState } from "react";
import { Map, useKakaoLoader } from "react-kakao-maps-sdk";
import { Coord } from "./types";

interface LocationSelectMapProps {
  className?: string;
  coord?: Coord;
  onChange?: (coord: Coord) => void;
}

const defaultCenter: Coord = { lat: 37.50235231, lng: 127.04444741 };

const LocationSelectMap = ({ className, coord, onChange }: LocationSelectMapProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
    libraries: ["services"]
  });
  const [mapInstance, setMapInstance] = useState<kakao.maps.Map | null>(null);

  return (
    <Map // 지도를 표시할 Container
      id="map"
      center={coord ?? defaultCenter}
      className={className}
      level={3} // 지도의 확대 레벨
      draggable={true}
      disableDoubleClick={true}
      onCreate={(mapInstance) => setMapInstance(mapInstance)}
      onClick={(_, mouseEvent) => {
        const latlng = mouseEvent.latLng;
        onChange?.({
          lat: latlng.getLat(),
          lng: latlng.getLng()
        });
        mapInstance?.setCenter(latlng);
      }}
    ></Map>
  );
};

export default LocationSelectMap;
