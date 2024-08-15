import React from "react";
import DiaryMap from "../../_components/DiaryMap";

interface DiaryMapPageProps {
  params: { id: string };
  searchParams: { lat: string; lng: string };
}

const DiaryMapPage: React.FC<DiaryMapPageProps> = ({ params, searchParams }) => {
  const { id } = params;

  const position = {
    lat: +searchParams.lat,
    lng: +searchParams.lng
  };
  return (
    <>
      <DiaryMap initialPosition={position} todoId={id} />
    </>
  );
};

export default DiaryMapPage;
