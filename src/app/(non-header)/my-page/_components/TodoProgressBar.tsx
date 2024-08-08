"use client";

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import NextBtn from "@/components/icons/myPage/NextBtn";
import NothingTodo from "./NothingTodo";

type PropTypes = {
  user_id: string;
};

const TodoProgressBar = ({ user_id }: PropTypes) => {
  const chartRef = useRef<HTMLCanvasElement & { chart?: Chart }>(null);
  const [totalTodo, setTotalTodo] = useState<number>();
  const [doneTodo, setDoneTodo] = useState<number>();
  const [progressPercentage, setProgressPercentage] = useState<number>();

  const getTodos = async () => {
    const response = await fetch(`/api/myPage/todoProgressBar/${user_id}`);
    if (response.ok) {
      const { total, done } = await response.json();
      setTotalTodo(total);
      setDoneTodo(done);
      setProgressPercentage((done / total) * 100 * 3);
    }
  };

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line
  }, []);

  console.log(progressPercentage);

  // useEffect(() => {
  //   if (chartRef.current) {
  //     if (chartRef.current.chart) {
  //       chartRef.current.chart.destroy();
  //     }

  //     const canvas = chartRef.current;
  //     const context = canvas.getContext("2d") as CanvasRenderingContext2D;
  //     const parentElement = canvas.parentElement;

  //     // Set canvas width and height based on parent element
  //     // canvas.width = 300;
  //     // canvas.height = 24; // Set the desired height

  //     // // Optionally, you can also set CSS styles if needed
  //     canvas.style.width = `${parentElement?.clientWidth}px`;
  //     canvas.style.height = "25px";

  //     const total = totalTodo as number;
  //     const done = doneTodo as number;

  //     const newChart = new Chart(context, {
  //       type: "bar",
  //       data: {
  //         labels: ["Todo"],
  //         datasets: [
  //           {
  //             label: "완료!",
  //             data: [(done / total) * 100],
  //             backgroundColor: ["#5B4DFF"],
  //             barThickness: 30,
  //             borderRadius: 20,
  //             stack: "stack1"
  //           },
  //           {
  //             label: "남은 투두",
  //             data: [100 - (done / total) * 100],
  //             backgroundColor: ["#F2F2F2"],
  //             barThickness: 30,
  //             borderRadius: 20,
  //             stack: "stack1"
  //           }
  //         ]
  //       },
  //       options: {
  //         responsive: true,
  //         indexAxis: "y",
  //         scales: {
  //           x: {
  //             beginAtZero: true,
  //             max: 100,
  //             ticks: {
  //               display: false // x축 라벨 숨기기
  //             },
  //             border: {
  //               display: false // x축 경계선 숨기기
  //             },
  //             grid: {
  //               display: false // x축 그리드 라인 숨기기
  //             }
  //           },
  //           y: {
  //             type: "category",
  //             ticks: {
  //               display: false // y축 라벨 숨기기
  //             },
  //             border: {
  //               display: false // y축 경계선 숨기기
  //             },
  //             grid: {
  //               display: false // y축 그리드 라인 숨기기
  //             }
  //           }
  //         },
  //         plugins: {
  //           legend: {
  //             display: false // 레전드 숨김
  //           },
  //           tooltip: {
  //             enabled: false // 툴팁 비활성화
  //           }
  //         }
  //         //   elements: {
  //         //     bar: {
  //         //       borderRadius: 10
  //         //     }
  //         //   }
  //       }
  //     });
  //     chartRef.current.chart = newChart;
  //   }
  //   // eslint-disable-next-line
  // }, [totalTodo, doneTodo]);

  console.log(totalTodo, doneTodo);

  return (
    <>
      {totalTodo === 0 ? (
        <div className="flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[166px] mt-10 bg-system-white border-2 border-grayTrans-30080 rounded-[32px]">
          <NothingTodo />
        </div>
      ) : (
        <div className="flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[166px] mt-10 bg-system-white border-2 border-paiTrans-40060 rounded-[32px]">
          <div className="flex flex-col">
            <div>
              <h1 className="min-w-[200px] leading-7 font-bold text-base text-gray-700">오늘의 투두는 순항중</h1>
              <h3 className="min-w-[200px] leading-7 font-medium text-sm text-gray-500">
                투두리스트를 확인하러 가볼까요?
              </h3>
            </div>
            <div className="absolute right-5">
              <NextBtn />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="relative min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px]">
              {/* <canvas ref={chartRef} /> */}
              <div
                style={{ width: `${progressPercentage}px` }}
                className={`absolute min-h-[24px] bg-pai-400 rounded-[20px]`}
              ></div>
            </div>
            <div className="flex justify-end text-sm font-bold leading-5 text-gray-400">
              <p>{doneTodo} </p> / {totalTodo}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TodoProgressBar;
