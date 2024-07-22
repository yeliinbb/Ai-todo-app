"use client";

import React, { useState } from "react";
import Calendar from "../../_components/Calendar";
import DiaryContent from "./DiaryContent";

const DiaryListPage = () => {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
  };
  return (
    <>
      <Calendar handleDateSelect={handleDateSelect} />
      {selectedDate && <DiaryContent date={selectedDate} />}
    </>
  );
};

export default DiaryListPage;
