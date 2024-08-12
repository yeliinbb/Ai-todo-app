import { Coord, LocationData } from "./types";

export const coord2Address = (lat: number, lng: number): Promise<{ address: string; roadAddress?: string }[]> => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.kakao.maps.services.Geocoder();
    geocoder.coord2Address(lng, lat, (result, status) => {
      if (status === window.kakao.maps.services.Status.OK) {
        resolve(result.map((r) => ({ address: r.address.address_name, roadAddress: r.road_address?.address_name })));
      } else {
        reject("좌표를 주소로 변환 실패");
      }
    });
  });
};

export const searchPlaceKeyword = (address: string): Promise<string | undefined> => {
  return new Promise((resolve, reject) => {
    const places = new window.kakao.maps.services.Places();
    places.keywordSearch(address, (data, status) => {
      if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
        const place = data[0];
        resolve(place.place_name);
      } else {
        resolve(undefined);
      }
    });
  });
};

export const coordToLocation = async (coord: Coord): Promise<LocationData> => {
  try {
    const addresses = await coord2Address(coord.lat, coord.lng);
    const address = addresses[0];
    const placeName = address ? await searchPlaceKeyword(addresses[0].address) : undefined;
    return {
      coord,
      address: address?.address,
      roadAddress: address?.roadAddress,
      placeName: placeName
    };
  } catch (e) {
    console.error(e);
    return {
      coord
    };
  }
};
