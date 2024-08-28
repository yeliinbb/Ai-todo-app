import { LocationData } from "@/shared/LocationSelect/types";

export const getFormattedAddress = (address: LocationData): string | null => {
  if (!address) return null;

  const { placeName, roadAddress, address: addr } = address;

  const extractLastTwoWords = (str: string): string => {
    const words = str.split(" ");
    return words.slice(-2).join(" ");
  };

  const refinedRoadAddress = roadAddress ? extractLastTwoWords(roadAddress) : "";
  const refinedAddress = addr ? extractLastTwoWords(addr) : "";

  return placeName || refinedRoadAddress || refinedAddress || null;
};
