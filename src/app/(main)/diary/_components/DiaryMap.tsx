"use client";
import useselectedCalendarStore from "@/store/selectedCalendar.store";
import { CategoryCode, DiaryMapSearchMarkerType, KakaoMapPageProps, UpdateTOdoAddressType } from "@/types/diary.type";
import { updateTodoAddress } from "@/lib/utils/todos/updateTodoAddress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import DiaryMapSearchResult from "./DiaryMapSearchResult";

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
  const userId = loggedInUser?.user_id;
  const [clickAddress, setClickAddress] = useState<{
    placeName: string;
    mapClickAddress: string;
  }>({
    placeName: "",
    mapClickAddress: ""
  });
  const [showMarkerInfo, setShowMarkerInfo] = useState<number | null>(0);
  const [searchMarkers, setSearchMarkers] = useState<DiaryMapSearchMarkerType[]>([]);
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [categorySearch, setCategorySearch] = useState<CategoryCode>("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [showInitialPositionInfo, setShowInitialPositionInfo] = useState<boolean>(false);
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
      route.back();
    }
  });
  const handleUpdateAddress = (todoId: string, lat: number, lng: number) => {
    addLocationMutate.mutate({ todoId, lat, lng });
  };

  const [selectedCategory, setSelectedCategory] = useState<CategoryCode>("");
  const [isSearchResultVisible, setIsSearchResultVisible] = useState(false);
  const [isMapInteractionEnabled, setIsMapInteractionEnabled] = useState(true);

  //검색결과들 옆 > 클릭 시 해당 마커가 지도 중심이 되는 함수
  const centerMapOnMarker = (position: { lat: number; lng: number }) => {
    if (map) {
      map.panTo(new kakao.maps.LatLng(position.lat, position.lng));
    }
  };

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
            roadAddress: place.road_address_name
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

  const handleCategoryClick = useCallback(
    (category: CategoryCode) => {
      if (selectedCategory === category) {
        setSelectedCategory(category);
        searchNearbyPlaces();
        setCategorySearch(category);
      } else {
        setSelectedCategory(category);
        setCategorySearch(category);
        searchNearbyPlaces();
        setIsSearchResultVisible(true);
      }
    },
    [selectedCategory, searchNearbyPlaces]
  );
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
          const mapInitialAddress = roadAddress ? roadAddress : address;

          const places = new window.kakao.maps.services.Places();
          places.keywordSearch(
            mapInitialAddress,
            (data, status) => {
              if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                const place = data[0];
                setInitialAddress({
                  placeName: place.place_name ? place.place_name : "장소명이 없습니다.",
                  mapClickAddress: place.road_address_name || place.address_name
                });
              } else {
                setInitialAddress({
                  placeName: "장소명이 없습니다.",
                  mapClickAddress: mapInitialAddress
                });
              }
            },
            {
              location: new kakao.maps.LatLng(initialPosition.lat, initialPosition.lng),
              radius: 200
            }
          );
        }
      });
    }
  }, [loading, error, initialPosition]);

  const [locationInfo, setLocationInfo] = useState<{
    position: { lat: number; lng: number };
    placesName: string;
    address: string;
  }>({
    position: { lat: 0, lng: 0 },
    placesName: "",
    address: ""
  });
  const [showLocationInfo, setShowLocationInfo] = useState<boolean>(true);

  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          const latLng = new kakao.maps.LatLng(lat, lng);

          if (map) {
            map.setCenter(latLng);

            const geocoder = new kakao.maps.services.Geocoder();

            geocoder.coord2Address(latLng.getLng(), latLng.getLat(), (result, status) => {
              if (status === kakao.maps.services.Status.OK) {
                const address = result[0];
                const jibunAddress = address.address.address_name;
                const roadAddress = address.road_address?.road_name;
                const myPositionAddress = roadAddress ? roadAddress : jibunAddress;

                const places = new window.kakao.maps.services.Places();
                places.keywordSearch(
                  myPositionAddress,
                  (data, status) => {
                    if (status === window.kakao.maps.services.Status.OK) {
                      const place = data[0];
                      setLocationInfo({
                        position: { lat: lat, lng: lng },
                        placesName: place.place_name,
                        address: myPositionAddress
                      });
                    } else {
                      setLocationInfo({
                        position: { lat: lat, lng: lng },
                        placesName: "장소명이 없습니다.",
                        address: myPositionAddress
                      });
                    }
                  },
                  {
                    location: new kakao.maps.LatLng(lat, lng),
                    radius: 200
                  }
                );
              } else {
                console.error("Geocoder failed with status:", status);
                toast.error("주소를 가져오는 데 실패했습니다.");
              }
            });
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
          places.keywordSearch(
            mapClickAddress,
            (data, status) => {
              if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
                const place = data[0];
                setClickAddress(() => ({
                  placeName: place.place_name ? place.place_name : "장소명이 없습니다.",
                  mapClickAddress: place.road_address_name || place.address_name
                }));
              } else {
                setClickAddress(() => ({
                  placeName: "장소명이 없습니다.",
                  mapClickAddress: mapClickAddress
                }));
              }
            },
            {
              location: new kakao.maps.LatLng(markerPosition.lat, markerPosition.lng),
              radius: 200
            }
          );
        }
      });
    }
  }, [markerPosition]);
  const handlePrevPage = () => {
    route.back();
  };
  useEffect(() => {
    if (searchMarkers.length > 0) {
      setIsSearchResultVisible(true);
      setIsMapInteractionEnabled(false);
    } else {
      setIsSearchResultVisible(false);
      setIsMapInteractionEnabled(true);
    }
  }, [searchMarkers]);

  useEffect(() => {
    if (selectedCategory) {
      setIsSearchResultVisible(true);
    } else {
      setIsSearchResultVisible(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (map && searchMarkers.length > 0) {
      map.panTo(new kakao.maps.LatLng(searchMarkers[0].position.lat, searchMarkers[0].position.lng));
    }
  }, [map, searchMarkers]);
  if (loading) return <div>loading...</div>;
  return (
    <>
      <div className="absolute top-4 left-4 w-[calc(100%-32px)] mx-auto flex flex-col gap-2 z-50 pointer-events-none">
        <div className=" flex items-center gap-2 justify-between pointer-events-auto">
          <DiaryMapPreviousIcon handlePrevPage={handlePrevPage} />
          <form
            onSubmit={(e) => {
              handleSearch(e);
            }}
            className="bg-system-white h-[52px] w-[calc(100%-64px)] rounded-full px-5 py-3 flex justify-between items-center border-grayTrans-60080 border gap-0.5"
          >
            <input
              type="text"
              ref={searchRef}
              placeholder="검색어"
              className="h-6 w-[calc(100%-0.125rem-24px)] outline-none placeholder:text-gray-400 text-gray-900 text-sm font-medium placeholder:block placeholder:leading-6 pt-0.5"
              maxLength={25}
            />

            <button type="submit" className="w-6 h-6">
              <DiaryMapSearchIcon />
            </button>
          </form>
        </div>
        <div className="w-fit pointer-events-auto">
          <ul className="flex gap-4 items-center">
            {categoryList.map((category, index) => (
              <li
                key={category.code + index}
                className="bg-pai-300 text-system-white px-4 py-1 rounded-full h-7 cursor-pointer flex items-center"
                onClick={() => {
                  handleCategoryClick(category.code);
                }}
              >
                <p className="text-xs font-medium leading-6 h-6">{category.keyWord}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <DiaryMapMoveToMyLocation
        getCurrentLocation={getCurrentLocation}
        clasName={`absolute left-4 bottom-9 z-10 ${isSearchResultVisible ? "hidden" : "block"}`}
      />
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
          <CustomOverlayMap clickable={true} position={markerPosition} zIndex={2}>
            <DiaryMapMarkerIcon />
            <div className="customoverlay">
              <div className="w-[308px] px-5 py-4 bg-system-white shadow-xl text-green-800 z-auto absolute top-9 left-[-50px] rounded-[32px] border border-pai-200 box-border">
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
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
        )}
        {locationInfo && (
          <CustomOverlayMap clickable={true} position={locationInfo.position} zIndex={1}>
            <DiaryMapMarkerIcon
              onClick={() => {
                setShowLocationInfo((prev) => !prev);
              }}
            />
            {showLocationInfo && (
              <div className="customoverlay">
                <div className="w-[308px] px-5 py-4 bg-system-white shadow-xl text-green-800 absolute top-9 left-[-50px] rounded-[32px] border border-pai-200 box-border">
                  <div>
                    <p className="text-lg font-extrabold h-7 leading-7 text-gray-800">
                      {locationInfo.placesName || "장소명이 없습니다."}
                    </p>
                    <p className="h-6 text-sm font-medium text-gray-600 leading-6">
                      {locationInfo.address || "해당위치는 주소없습니다."}
                    </p>
                  </div>
                  <div className="flex justify-end w-full mt-3">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toast.success("위치 업데이트 완료");
                        handleUpdateAddress(todoId, locationInfo.position.lat, locationInfo.position.lng);
                      }}
                      className="w-[103px] px-4 h-7 bg-pai-300 text-system-white rounded-full text-xs leading-6 font-medium"
                    >
                      장소 선택하기
                    </button>
                  </div>
                </div>
              </div>
            )}
          </CustomOverlayMap>
        )}
        {searchMarkers.map((marker, index) => (
          <CustomOverlayMap
            key={index}
            clickable={true}
            position={marker.position}
            zIndex={showMarkerInfo === index ? 1 : 0}
          >
            {showMarkerInfo === index && (
              <div className="customoverlay z-50">
                <div className="w-[308px] px-5 py-4 bg-system-white shadow-xl text-green-800 absolute top-9 left-[-50px] rounded-[32px] border border-pai-200 box-border z-50">
                  <div>
                    <p className="text-lg font-extrabold h-7 leading-7 text-gray-800">
                      {marker.content || "장소명이 없습니다."}
                    </p>
                    <p className="h-6 text-sm font-medium text-gray-600 leading-6">
                      {marker.roadAddress || "해당위치는 주소없습니다."}
                    </p>
                  </div>
                  <div className="flex justify-end w-full mt-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success("위치 업데이트 완료");
                        handleUpdateAddress(todoId, marker.position.lat, marker.position.lng);
                      }}
                      className="w-[103px] px-4 h-7 bg-pai-300 text-system-white rounded-full text-xs leading-6 font-medium"
                    >
                      장소 선택하기
                    </button>
                  </div>
                </div>
              </div>
            )}
            <DiaryMapMarkerIcon
              onClick={() => {
                setShowMarkerInfo((prevIndex) => (prevIndex === index ? null : index));
              }}
            />
          </CustomOverlayMap>
        ))}
        <CustomOverlayMap //해당 마커는 현재 해당 투두내의 위치를 나타나는데 위치정보가 없거나 0이면 나의 위치를 표시합니다.
          clickable={true}
          position={initialPosition}
          zIndex={1}
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
                      onClick={(e) => {
                        e.stopPropagation();
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
      {isSearchResultVisible && (
        <>
          <div className="absolute bottom-0 left-0 right-0 bg-system-white">
            <DiaryMapSearchResult
              getCurrentLocation={getCurrentLocation}
              searchMarkers={searchMarkers}
              handleUpdateAddress={handleUpdateAddress}
              todoId={todoId}
              isVisible={isSearchResultVisible}
              setIsVisible={setIsSearchResultVisible}
              onMarkerSelect={centerMapOnMarker}
              setShowMarkerInfo={setShowMarkerInfo}
              setSearchMarkers={setSearchMarkers}
            />
          </div>
        </>
      )}
    </>
  );
};

export default React.memo(KakaoMapPage);
