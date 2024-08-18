import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import { RefHandles } from "react-spring-bottom-sheet/dist/types";

interface CustomBottomSheetProps {
  open: boolean;
  onDismiss: () => void;
  snapPoints: ({ maxHeight }: { maxHeight: number }) => number[];
  defaultSnap: (snapPoints: { snapPoints: number[] }) => number;
  blocking?: boolean;
  expandOnContentDrag?: boolean;
  children: React.ReactNode;
  className:string;
}

const CustomBottomSheet = forwardRef<RefHandles, CustomBottomSheetProps>((props, ref) => {
  const localRef = useRef<RefHandles>(null);

  useImperativeHandle(ref, () => ({
    snapTo: (snapPoint: number | ((state: any) => number)) => {
      if (localRef.current) {
        localRef.current.snapTo(snapPoint);
      }
    },
    height: 0
  }));

  return (
    <BottomSheet
      ref={localRef}
      open={props.open}
      onDismiss={props.onDismiss}
      snapPoints={props.snapPoints}
      defaultSnap={props.defaultSnap}
      blocking={props.blocking}
      expandOnContentDrag={props.expandOnContentDrag}
      className="bottom-sheet-main"
    >
      {props.children}
    </BottomSheet>
  );
});
CustomBottomSheet.displayName = "CustomBottomSheet";
export default CustomBottomSheet;
