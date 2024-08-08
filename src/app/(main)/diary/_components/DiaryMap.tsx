"use client";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { CategoryCode, KakaoMapPageProps, UpdateTOdoAddressType } from "@/types/diary.type";
import { updateTodoAddress } from "@/lib/utils/todos/updateTodoAddress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { FormEvent, useCallback } from "react";
import { useEffect, useRef, useState } from "react";
import { Map, ZoomControl, MapMarker, useKakaoLoader, CustomOverlayMap } from "react-kakao-maps-sdk";
import { useUserData } from "@/hooks/useUserData";
import { categoryList } from "@/lib/utils/diaries/diaryMapCategorylist";
import { toast } from "react-toastify";
import DiaryMapSearchIcon from "@/components/icons/diaries/DiaryMapSearchIcon";
import DiaryMapPreviousIcon from "@/components/icons/diaries/DiaryMapPreviousIcon";
import DiaryMapMarkerIcon from "@/components/icons/diaries/DiaryMapMarkerIcon";
import DiaryCurrentLocation from "@/components/icons/diaries/DiaryCurrentLocation";
import DiaryMapMoveToMyLocation from "@/components/icons/diaries/DiaryMapMoveToMyLocation";

const KakaoMapPage = ({ initialPosition, todoId }: KakaoMapPageProps) => {
  const [loading, error] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY as string,
    libraries: ["services"]
  });
  const [markerPosition, setMarkerPosition] = useState<{
    lat: number;
    lng: number;
  }>();
  const { data: loggedInUser } = useUserData();
  const userId = loggedInUser?.email;
  const [clickAddress, setClickAddress] = useState<{
    placeName: string;
    mapClickAddress: string;
  }>({
    placeName: "",
    mapClickAddress: ""
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
  const [initialAddress, setInitialAddress] = useState<{
    placeName: string;
    mapClickAddress: string;
  }>({
    placeName: "",
    mapClickAddress: ""
  });
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

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    // e.setSearchResult(true);
    e.preventDefault();
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

  useEffect(() => {
    if (!loading && !error && initialPosition) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      const coord = new window.kakao.maps.LatLng(initialPosition.lat, initialPosition.lng);
      geocoder.coord2Address(coord.getLng(), coord.getLat(), async (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const address = result[0].address.address_name;
          const roadAddress = result[0].road_address?.address_name;
          const placeName = result[0].road_address?.building_name;
          const mapInitialAddress = roadAddress || address;
          setInitialAddress({
            placeName: placeName || "장소명 찾지 못했습니다.",
            mapClickAddress: mapInitialAddress
          });

          const places = new window.kakao.maps.services.Places();
          places.keywordSearch(mapInitialAddress, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
              const place = data[0];
              setInitialAddress((prev) => ({
                ...prev,
                placeName: place.place_name || "장소명이 없습니다.",
                mapClickAddress: place.road_address_name || place.address_name
              }));
            }
          });
        }
      });
    }
  }, [loading, error, initialPosition]);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const latLng = new kakao.maps.LatLng(lat, lng);

          if (map) {
            map.setCenter(latLng);
          }
          setShowInitialPositionInfo(true);
          toast.success("현재 위치로 지도 중심 이동 완료");
        },
        (error) => {
          console.error(error);
          toast.error("위치를 가져오는 데 실패했습니다.");
        }
      );
    } else {
      toast.error("Geolocation이 지원되지 않는 브라우저입니다.");
    }
  }, [map]);

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
          const address = result[0];
          const jibunAddress = address.address.address_name;
          const roadAddress = address.road_address?.address_name;
          const mapClickAddress = roadAddress || jibunAddress;

          const places = new window.kakao.maps.services.Places();
          places.keywordSearch(mapClickAddress, (data, status) => {
            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
              const place = data[0];
              setClickAddress((prev) => ({
                placeName: place.place_name || "장소명이 없습니다.",
                mapClickAddress: place.road_address_name || place.address_name
              }));
            }
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
  const [searchResult, setSearchResult] = useState<boolean>(false);
  if (loading) return <div>loading...</div>;
  return (
    <>
      <div className="absolute top-4 left-4 z-10 w-[calc(100%-32px)] mx-auto">
        <div className=" flex items-center gap-2 justify-between">
          <DiaryMapPreviousIcon />
          <form
            onSubmit={(e) => {
              handleSearch(e);
            }}
            className="bg-system-white h-14 w-[calc(100%-64px)] rounded-full px-5 py-3 flex justify-between items-center border-grayTrans-60080 border gap-0.5"
          >
            <input
              type="text"
              ref={searchRef}
              placeholder="검색어"
              className="h-6 w-[calc(100%-0.125rem-24px)] outline-none placeholder:text-gray-400 text-gray-900 text-sm font-medium"
              maxLength={25}
            />

            <button type="submit" className="w-6 h-6">
              <DiaryMapSearchIcon />
            </button>
          </form>
        </div>
      </div>
      {searchMarkers.length > 0 ? (
        <div
          className={`bg-system-white bg-opacity-80 border border-gray-200 rounded-lg shadow-lg overflow-y-auto max-h-[750px] mt-4 p-4 w-min absolute top-5`}
        >
          <div className="relative">
            <div className="sticky top-0 h-[30px] bg-system-white">
              <p
                onClick={() => {
                  setSearchResult(false);
                }}
                className="text-end right-4 top-0 cursor-pointer"
              >
                X
              </p>
            </div>
          </div>
          <ul className="grid gap-4 overflow-y-auto max-h-[calc(750px-30px)]">
            {searchMarkers.map((place, index) => (
              <li key={place.url + index} className={`border-b-gray-200 text-black`}>
                <div className="w-[300px] p-4 bg-system-white rounded-lg shadow-xl text-green-800 z-50 relative top-[-1px] left-[-1px]">
                  <p className="font-bold">장소명: {place.content}</p>
                  <p>지번 주소: {place.jibunAddress}</p>
                  <p>도로명 주소: {place.roadAddress}</p>
                  <p>전화번호: {place.phone ? place.phone : "전화번호 없습니다."}</p>
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
                      toast.success(`검색 결과의 위치를 추가 완료`);
                      handleUpdateAddress(todoId, place.position.lat, place.position.lng);
                    }}
                    className="mt-2 p-2 bg-fai-300 text-system-white rounded-lg hover:bg-fai-200"
                  >
                    추가
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {/* <div className="absolute top-5 z-10 left-80">
        <ul className="flex gap-4 items-center">
          {visibleCategories.map((category, index) => (
            <li
              key={category.code + index}
              className="px-4 py-2 bg-fai-300 text-system-white hover:bg-fai-200 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer text-sm font-semibold"
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
                className="px-4 py-2 bg-fai-300 text-system-white hover:bg-fai-200 rounded-full shadow-md hover:bg-blue-600 transition duration-300 ease-in-out cursor-pointer text-sm font-semibold w-[70px] "
              >
                {isOpen ? "닫기" : "더보기"}
              </button>
              {isOpen && (
                <ul className="absolute left-0 mt-2 w-48 bg-system-white rounded-md shadow-xl z-20">
                  {dropdownCategories.map((category, index) => (
                    <li
                      key={category.code + index}
                      className="px-4 py-2 cursor-pointer text-sm rounded-md bg-system-white hover:bg-gray-200 transition-all"
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
      </div> */}
      <DiaryMapMoveToMyLocation getCurrentLocation={getCurrentLocation} />
      <Map // 지도를 표시할 Container
        id="map"
        center={initialPosition}
        className="w-full h-screen"
        level={3} // 지도의 확대 레벨
        draggable={true}
        disableDoubleClick={true}
        onClick={(_, mouseEvent) => {
          const latlng = mouseEvent.latLng;
          setMarkerPosition({
            lat: latlng.getLat(),
            lng: latlng.getLng()
          });
        }}
        onCreate={(mapInstance) => setMap(mapInstance)}
      >
        <ZoomControl position={"BOTTOMRIGHT"} />
        {markerPosition && (
          // <MapMarker position={markerPosition}>
          <CustomOverlayMap position={markerPosition}>
            <DiaryMapMarkerIcon />
            <div className="customoverlay">
              <div className="w-[308px] px-5 py-4 bg-system-white shadow-xl text-green-800 z-50 absolute top-9 left-[-50px] rounded-[32px] border border-pai-200 box-border">
                <div>
                  <p className="text-lg font-extrabold h-7 leading-7 text-gray-800">
                    {clickAddress.placeName || "장소명이 없습니다."}
                  </p>
                  <p className="h-6 text-sm font-medium text-gray-600 leading-6">
                    {clickAddress.mapClickAddress || "해당위치는 주소없습니다."}
                  </p>
                </div>
                <div className="flex justify-end w-full mt-3">
                  <button
                    onClick={() => {
                      toast.success("위치 업데이트 완료");
                      handleUpdateAddress(todoId, markerPosition.lat, markerPosition.lng);
                    }}
                    className="w-[103px] px-4 h-7 bg-pai-300 text-system-white rounded-full text-xs leading-6 font-medium"
                  >
                    장소 선택하기
                  </button>
                </div>
              </div>
            </div>
          </CustomOverlayMap>
          // </MapMarker>
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
                    toast.success("위치 업데이트 완료");
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
        <CustomOverlayMap //해당 마커는 현재 해당 투두내의 위치를 나타나는데 위치정보가 없거나 0이면 나의 위치를 표시합니다.
          position={initialPosition}
        >
          <DiaryCurrentLocation
            onClick={() => {
              setShowInitialPositionInfo(true);
            }}
          />
          {showInitialPositionInfo && (
            <>
              <div className="customoverlay">
                <div className="w-[308px] px-5 py-4 bg-system-white shadow-xl text-green-800 z-50 absolute top-9 left-[-50px] rounded-[32px] border border-pai-200 box-border">
                  <div>
                    <p className="text-lg font-extrabold h-7 leading-7 text-gray-800">{initialAddress.placeName}</p>
                    <p className="h-6 text-sm font-medium text-gray-600 leading-6">{initialAddress.mapClickAddress}</p>
                  </div>
                  <div className="flex justify-end w-full mt-3">
                    <button
                      onClick={() => {
                        setShowInitialPositionInfo(false);
                      }}
                      className="w-[103px] px-4 h-7 bg-pai-300 text-system-white rounded-full text-xs leading-6 font-medium"
                    >
                      닫기
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CustomOverlayMap>
      </Map>
    </>
  );
};

export default React.memo(KakaoMapPage);
