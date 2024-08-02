"use client";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { KakaoMapPageProps, UpdateTOdoAddressType } from "@/types/diary.type";
import { updateTodoAddress } from "@/lib/utils/todos/updateTodoAddress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import { Map, ZoomControl, MapTypeId, MapMarker, useKakaoLoader } from "react-kakao-maps-sdk";
import { useUserData } from "@/hooks/useUserData";

const categoryList: { code: CategoryCode; keyWord: string }[] = [
  { code: "MT1", keyWord: "대형마트" },
  { code: "CS2", keyWord: "편의점" },
  { code: "PS3", keyWord: "어린이집" },
  { code: "SC4", keyWord: "학교" },
  { code: "AC5", keyWord: "학원" },
  { code: "PK6", keyWord: "주차장" },
  { code: "OL7", keyWord: "주유소" },
  { code: "SW8", keyWord: "지하철역" },
  { code: "BK9", keyWord: "은행" },
  { code: "CT1", keyWord: "문화서실" },
  { code: "AG2", keyWord: "중개업소" },
  { code: "PO3", keyWord: "공공기관" },
  { code: "AT4", keyWord: "관광명소" },
  { code: "AD5", keyWord: "숙박" },
  { code: "FD6", keyWord: "음식점" },
  { code: "CE7", keyWord: "카페" },
  { code: "HP8", keyWord: "병원" },
  { code: "PM9", keyWord: "약국" }
];
type CategoryCode =
  | ""
  | "MT1"
  | "CS2"
  | "PS3"
  | "SC4"
  | "AC5"
  | "PK6"
  | "OL7"
  | "SW8"
  | "BK9"
  | "CT1"
  | "AG2"
  | "PO3"
  | "AT4"
  | "AD5"
  | "FD6"
  | "CE7"
  | "HP8"
  | "PM9";
type MapType = "TRAFFIC" | "SKYVIEW" | "BICYCLE" | "ROADMAP" | "HYBRID" | "TERRAIN" | "OVERLAY";
const mapTypes: { id: MapType; label: string }[] = [
  { id: "ROADMAP", label: "기본 지도" },
  { id: "TRAFFIC", label: "교통정보" },
  { id: "HYBRID", label: "혼합 지도" },
  { id: "SKYVIEW", label: "항공 사진" },
  { id: "BICYCLE", label: "자전거 도로" },
  { id: "TERRAIN", label: "지형도" },
  { id: "OVERLAY", label: "오버레이" }
];

const KakaoMapPage = ({ initialPosition, todoId }: KakaoMapPageProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
    libraries: ["services"]
  });
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>();
  const {data:loggedInUser}=useUserData()
  const userId = loggedInUser?.email
  console.log(userId)
  const [selectedMapType, setSelectedMapType] = useState<MapType>("ROADMAP");
  const [showMoreTypes, setShowMoreTypes] = useState<boolean>(false);
  const [clickAddress, setClickAddress] = useState<{
    buildingName: string;
    jibunAddress: string;
    roadAddress: string;
  }>({
    buildingName: "",
    jibunAddress: "",
    roadAddress: ""
  });
  const [showMarkerInfo, setShowMarkerInfo] = useState<number | null>(null);
  const [searchMarkers, setSearchMarkers] = useState<
    {
      position: { lat: number; lng: number };
      content: string;
      jibunAddress: string;
      roadAddress: string;
      phone: string;
      url: string;
    }[]
  >([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [categorySearch, setCategorySearch] = useState<CategoryCode>("");
  const visibleCategories = categoryList.slice(0, 2);
  const dropdownCategories = categoryList.slice(4);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const [showInitialPositionInfo, setShowInitialPositionInfo] = useState<boolean>(true);
  const { selectedDate } = useselectedCalendarStore();
  const route = useRouter();
  const queryClient = useQueryClient();
  const addLocationMutate = useMutation<void, Error, UpdateTOdoAddressType>({
    mutationFn: updateTodoAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["diaryTodos", userId, selectedDate] });
    }
  });
  const handleUpdateAddress = (todoId: string, lat: number, lng: number) => {
    addLocationMutate.mutate({ todoId, lat, lng });
    route.back();
  };

  const handleMapTypeChange = useCallback((type: MapType) => {
    setSelectedMapType(type);
  }, []);

  const handleCategoryClick = useCallback((category: CategoryCode) => {
    setCategorySearch(category);
  }, []);
  const getCenterPosition = useCallback(() => {
    if (map) {
      const center = map.getCenter();
      return { lat: center.getLat(), lng: center.getLng() };
    }
    return { lat: initialPosition.lat, lng: initialPosition.lng };
  }, [map, initialPosition]);

  const searchNearbyPlaces = useCallback(() => {
    if (!categorySearch || !map) return;

    const places = new kakao.maps.services.Places();
    const centerPosition = getCenterPosition();

    places.categorySearch(
      categorySearch,
      (data, status) => {
        if (status === kakao.maps.services.Status.OK) {
          const markers = data.map((place) => ({
            position: {
              lat: +place.y,
              lng: +place.x
            },
            content: place.place_name,
            jibunAddress: place.address_name,
            roadAddress: place.road_address_name,
            phone: place.phone,
            url: place.place_url
          }));
          setSearchMarkers(markers);
        }
      },
      {
        location: new kakao.maps.LatLng(centerPosition.lat, centerPosition.lng),
        radius: 1000
      }
    );
  }, [categorySearch, map, getCenterPosition]);

  const handleSearch = () => {
    if (!searchRef.current?.value) return;
    const places = new kakao.maps.services.Places();

    places.keywordSearch(searchRef.current?.value, (data, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const bounds = new kakao.maps.LatLngBounds();
        const markers = data.map((place) => {
          const position = {
            lat: +place.y,
            lng: +place.x
          };
          bounds.extend(new kakao.maps.LatLng(position.lat, position.lng));
          return {
            position,
            content: place.place_name,
            jibunAddress: "",
            roadAddress: "",
            phone: place.phone,
            url: place.place_url
          };
        });

        setSearchMarkers(markers);
        if (map && markers.length > 0) {
          map.setBounds(bounds);
          map.panTo(new kakao.maps.LatLng(markers[0].position.lat, markers[0].position.lng));
        }
        updateSearchMarkersAddresses(markers);
      }
    });
  };

  const updateSearchMarkersAddresses = (markers: typeof searchMarkers) => {
    const geocoder = new kakao.maps.services.Geocoder();
    markers.forEach((marker, index) => {
      const coord = new kakao.maps.LatLng(marker.position.lat, marker.position.lng);
      geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setSearchMarkers((prevMarkers) =>
            prevMarkers.map((m, i) =>
              i === index
                ? {
                    ...m,
                    jibunAddress: result[0].address.address_name || "지번주소가 없습니다.",
                    roadAddress: result[0].road_address?.address_name || "도로명 주소가 없습니다."
                  }
                : m
            )
          );
        }
      });
    });
  };
  const [initialAddress, setInitialAddress] = useState({
    placeName: "",
    jibunAddress: "",
    roadAddress: ""
  });

  useEffect(() => {
    if (!loading && !error && initialPosition) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(initialPosition.lat, initialPosition.lng);
      geocoder.coord2Address(coord.getLng(), coord.getLat(), async (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          const roadAddress = result[0].road_address?.address_name;
          const placeName = result[0].road_address?.building_name;
          console.log(result[0]);
          setInitialAddress({
            placeName: placeName || "장소명 찾지 못했습니다.",
            jibunAddress: address || "지번주소가 없습니다.",
            roadAddress: roadAddress || "도로명 주소가 없습니다."
          });
        }
      });
    }
  }, [loading, error, initialPosition]);

  useEffect(() => {
    if (categorySearch) {
      searchNearbyPlaces();
    }
  }, [categorySearch, searchNearbyPlaces]);

  useEffect(() => {
    if (markerPosition) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(markerPosition.lat, markerPosition.lng);
      geocoder.coord2Address(coord.getLng(), coord.getLat(), (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const buildingName = result[0].road_address?.building_name
            ? result[0].road_address.building_name
            : "장소명이 없습니다.";
          const jibunAddress = result[0].address.address_name ? result[0].address.address_name : "지번주소가 없습니다.";
          const roadAddress = result[0].road_address ? result[0].road_address.address_name : "도로명 주소가 없습니다.";

          setClickAddress({
            buildingName,
            jibunAddress,
            roadAddress
          });
        }
      });
    }
  }, [markerPosition]);

  useEffect(() => {
    if (map && searchMarkers.length > 0) {
      map.panTo(new kakao.maps.LatLng(searchMarkers[0].position.lat, searchMarkers[0].position.lng));
    }
  }, [map, searchMarkers]);
  if (loading) return <div>loading...</div>;

  return (
    <>
      <div className="absolute top-4 left-4 z-10">
        <input
          type="text"
          ref={searchRef}
          className="border p-2 rounded-lg shadow-lg text-black"
          placeholder="키워드를 입력하세요"
        />
        <button onClick={handleSearch} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg">
          검색
        </button>
        {searchMarkers.length > 0 ? (
          <div
            className={`bg-white bg-opacity-80 border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-[750px] mt-4 p-4`}
          >
            <ul className="grid gap-4 ">
              {searchMarkers.map((place, index) => (
                <li key={place.url + index} className={`border-b-gray-200 text-black`}>
                  <div className="w-[300px] p-4 bg-white rounded-lg shadow-xl text-green-800 z-50 relative top-[-1px] left-[-1px]">
                    <p className="font-bold">장소명: {place.content}</p>
                    <p>지번 주소: {place.jibunAddress}</p>
                    <p>도로명 주소: {place.roadAddress}</p>
                    <p>전화번호: {place.phone}</p>
                    <Link
                      href={place.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 block text-black decoration-1 w-max"
                    >
                      상세페이지 바로가기
                    </Link>
                    <button
                      onClick={() => {
                        alert(`검색 결과의 위치를 추가함`);
                        handleUpdateAddress(todoId, place.position.lat, place.position.lng);
                      }}
                      className="mt-2 p-2 bg-green-500 text-white rounded-lg"
                    >
                      추가
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div className="absolute top-5 z-10 left-80">
        <ul className="flex gap-4 items-center">
          {visibleCategories.map((category, index) => (
            <li
              key={category.code + index}
              className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer text-sm font-semibold"
              onClick={() => {
                handleCategoryClick(category.code);
              }}
            >
              {category.keyWord}
            </li>
          ))}
          {dropdownCategories.length > 0 && (
            <li className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer text-sm font-semibold w-[70px]"
              >
                {isOpen ? "닫기" : "더보기"}
              </button>
              {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
                  {dropdownCategories.map((category, index) => (
                    <li
                      key={category.code + index}
                      className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm rounded-md text-gray-700"
                      onClick={() => {
                        handleCategoryClick(category.code);
                        setIsOpen(false);
                      }}
                    >
                      {category.keyWord}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )}
        </ul>
      </div>

      <div className="absolute top-5 z-10 right-5">
        <div className="flex overflow-x-auto space-x-2">
          {mapTypes.slice(0, 2).map((type) => (
            <button
              key={type.id}
              className={`px-4 py-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition duration-300 ease-in-out cursor-pointer text-sm font-semibold ${
                selectedMapType === type.id ? "bg-blue-500 text-white" : "bg-white text-black"
              } border-gray-300 cursor-pointer`}
              onClick={() => handleMapTypeChange(type.id)}
            >
              {type.label}
            </button>
          ))}
          <button
            onClick={() => setShowMoreTypes((prev) => !prev)}
            className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer text-sm font-semibold w-[70px]"
          >
            {showMoreTypes ? "접기" : "더보기"}
          </button>
        </div>
        {showMoreTypes && (
          <ul className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl z-20">
            {mapTypes.slice(2).map((type) => (
              <li
                key={type.id}
                className={`px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm rounded-md text-gray-700 ${
                  selectedMapType === type.id ? "bg-blue-500 text-white" : "bg-white text-black"
                } border-gray-300 cursor-pointer`}
                onClick={() => handleMapTypeChange(type.id)}
              >
                {type.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <Map // 지도를 표시할 Container
        id="map"
        center={initialPosition}
        className="w-full h-screen"
        level={3} // 지도의 확대 레벨
        onClick={(_, mouseEvent) => {
          const latlng = mouseEvent.latLng;
          setMarkerPosition({
            lat: latlng.getLat(),
            lng: latlng.getLng()
          });
        }}
        onCreate={(mapInstance) => setMap(mapInstance)}
      >
        <MapTypeId type={selectedMapType} />
        <ZoomControl position={"BOTTOMRIGHT"} />
        {markerPosition && (
          <MapMarker position={markerPosition}>
            <div className="w-[400px] p-4 bg-white rounded-lg shadow-xl text-green-800 z-50 absolute top-[-100px] left-[-10px]">
              <div>
                <p>건물/장소명:{clickAddress.buildingName}</p>
                <p>지번 주소: {clickAddress.jibunAddress}</p>
                <p>도로명 주소: {clickAddress.roadAddress}</p>
              </div>
              <button
                onClick={() => {
                  alert(`위도${markerPosition.lat}+경도${markerPosition.lng}`);
                  handleUpdateAddress(todoId, markerPosition.lat, markerPosition.lng);
                }}
                className="mt-2 p-2 bg-green-500 text-white rounded-lg"
              >
                추가
              </button>
            </div>
          </MapMarker>
        )}
        {searchMarkers.map((marker, index) => (
          <MapMarker
            key={index}
            position={marker.position}
            onClick={() => {
              setShowMarkerInfo(index);
              if (map) {
                map.panTo(new kakao.maps.LatLng(marker.position.lat, marker.position.lng));
              }
            }}
          >
            {showMarkerInfo === index && (
              <div className="w-[400px] p-4 bg-white rounded-lg shadow-xl text-green-800 z-50 relative top-[-1px] left-[-1px]">
                <p className="font-bold">장소명: {marker.content}</p>
                <p>지번 주소: {marker.jibunAddress}</p>
                <p>도로명 주소: {marker.roadAddress}</p>
                <p>전화번호: {marker.phone}</p>
                <Link href={marker.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 block">
                  상세페이지
                </Link>
                <button
                  onClick={() => {
                    alert(`위도:${marker.position.lat}+경도:${marker.position.lng}`);
                    handleUpdateAddress(todoId, marker.position.lat, marker.position.lng);
                  }}
                  className="mt-2 p-2 bg-green-500 text-white rounded-lg"
                >
                  추가
                </button>
                <div className="absolute right-3 top-3 cursor-pointer" onClick={() => setShowMarkerInfo(null)}>
                  X
                </div>
              </div>
            )}
          </MapMarker>
        ))}
        <MapMarker //해당 마커는 현재 나의 위치를 표시합니다.
          position={initialPosition}
          onClick={() => {
            if (map) {
              map.panTo(new kakao.maps.LatLng(initialPosition.lat, initialPosition.lng));
              setShowInitialPositionInfo(true);
            }
          }}
          //   image={{ src: "/myposition.png", size: { width: 27, height: 40 } }}
        >
          {showInitialPositionInfo && (
            <div className="w-[400px] p-4 bg-white rounded-lg shadow-xl text-green-800 z-50 absolute top-[-120px] left-[-10px]">
              <div>
                <p>건물/장소명:{initialAddress.placeName}</p>
                <p>지번 주소: {initialAddress.jibunAddress}</p>
                <p>도로명 주소: {initialAddress.roadAddress}</p>
              </div>
              <button
                onClick={() => {
                  setShowInitialPositionInfo(false);
                }}
                className="mt-2 p-2 bg-green-500 text-white rounded-lg"
              >
                닫기
              </button>
            </div>
          )}
        </MapMarker>
      </Map>
    </>
  );
};

export default React.memo(KakaoMapPage);
