import { useCallback, useEffect, useMemo, useState } from "react";
import { cn } from "../utils";
import { Drawer, DrawerOverlay, DrawerPortal, DrawerPrimitive, DrawerTitle } from "../ui/drawer";
import { Button } from "../ui/button";
import { IoChevronBack } from "react-icons/io5";
import { Input } from "../ui/input";
import LocationSelectMap from "./LocationSelectMap";
import { Coord, LocationData } from "./types";
import { coordToLocation } from "./api";

export interface LocationSelectProps {
  defaultValue?: LocationData;
  value?: LocationData;
  onChange?: (value: LocationData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LocationSelect = ({ defaultValue, value, onChange, placeholder, className, disabled }: LocationSelectProps) => {
  const [currentValue, setCurrentValue] = useState<LocationData | undefined>(value ?? defaultValue);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    setCurrentValue(value);
  }, [value]);

  const handleChangeCoord = useCallback(async (coord: Coord) => {
    const locationData = await coordToLocation(coord);
    setCurrentValue(locationData);
  }, []);

  const handleSelect = useCallback(
    (data: LocationData) => {
      onChange?.(data);
      setOpen(false);
    },
    [onChange]
  );

  return (
    <>
      <div
        className={cn(`${disabled ? "" : "cursor-pointer"} text-gray-400 flex items-center`, className)}
        onClick={() => {
          if (!disabled) {
            setOpen(true);
          }
        }}
      >
        {currentValue ? (
          <span className="rounded-full bg-pai-400 text-system-white px-2 py-1 text-[10px]">
            {currentValue.placeName ?? currentValue.roadAddress ?? currentValue.address}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} direction="left" handleOnly>
        {/* <DrawerTitle className="hidden">장소 선택</DrawerTitle> */}
        <DrawerPortal>
          <DrawerOverlay />
          <DrawerPrimitive.Content className="fixed inset-x-0 bottom-0 z-50 flex h-svh flex-col border bg-background border-none">
            <div className="absolute top-0 left-0 w-full flex items-center py-1 px-2 z-[2] gap-2">
              <Button
                className="rounded-full px-2.5 bg-system-white"
                onClick={() => setOpen(false)}
                variant={"linedGrayScale"}
              >
                <IoChevronBack />
              </Button>
              <Input className="flex-1" />
            </div>
            {currentValue && (
              <div className="absolute left-[50%] top-[50%] -translate-x-[50%] -translate-y-[150%] w-[300px] h-[100px] bg-system-white border-b z-[2] flex flex-col">
                <h3>{currentValue.placeName}</h3>
                <span>{currentValue.roadAddress ?? currentValue.address}</span>
                <Button onClick={() => handleSelect(currentValue)}>선택하기</Button>
              </div>
            )}
            <LocationSelectMap className="w-full h-full" onChange={handleChangeCoord} coord={currentValue?.coord} />
          </DrawerPrimitive.Content>
        </DrawerPortal>
      </Drawer>
    </>
  );
};

export default LocationSelect;
