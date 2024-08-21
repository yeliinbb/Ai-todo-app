import { useCallback, useState } from "react";
import { cn } from "../utils";
import { Drawer, DrawerPortal, DrawerPrimitive } from "../ui/drawer";
import { Button } from "../ui/button";
import { IoChevronBack } from "react-icons/io5";
import LocationSelectMap from "./LocationSelectMap";
import { Coord, LocationData } from "./types";
import AddressSearcher from "./AddressSearcher";

export interface LocationSelectProps {
  defaultValue?: LocationData;
  value?: LocationData;
  onChange?: (value: LocationData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const LocationSelect = ({ defaultValue, value, onChange, placeholder, className, disabled }: LocationSelectProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const [mapCenter, setMapCenter] = useState<Coord | undefined>((value ?? defaultValue)?.coord);

  const handleOpen = useCallback(() => {
    setMapCenter((value ?? defaultValue)?.coord);
    setOpen(true);
  }, [defaultValue, value]);

  const handleClickDetail = useCallback((data: LocationData) => {
    setMapCenter(data.coord);
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
            handleOpen();
          }
        }}
      >
        {value ? (
          <span className="rounded-full bg-pai-400 text-system-white px-2 py-1 text-[10px]">
            {value.placeName ?? value.roadAddress ?? value.address}
          </span>
        ) : (
          <span className="text-gray-400">{placeholder}</span>
        )}
      </div>
      <Drawer open={open} onClose={() => setOpen(false)} direction="left" modal={false} handleOnly>
        {/* <DrawerTitle className="hidden">장소 선택</DrawerTitle> */}
        <DrawerPortal>
          <DrawerPrimitive.Content
            className="fixed inset-x-0 bottom-0 z-50 flex h-svh flex-col border bg-background border-none
          desktop:left-[max(21.75rem,min(calc(21.75rem+(100vw-1200px)*0.325),39.75rem))] desktop:duration-300 desktop:east-in-out"
          >
            <div className="absolute top-0 left-0 w-full flex items-center py-1 px-2 z-[2] gap-2">
              <Button
                className="rounded-full px-2.5 bg-system-white"
                onClick={() => setOpen(false)}
                variant={"linedGrayScale"}
              >
                <IoChevronBack />
              </Button>
              <AddressSearcher onSelect={handleSelect} onClickDetail={handleClickDetail} />
            </div>
            {open && <LocationSelectMap className="w-full h-full" center={mapCenter} onSelect={handleSelect} />}
          </DrawerPrimitive.Content>
        </DrawerPortal>
      </Drawer>
    </>
  );
};

export default LocationSelect;
