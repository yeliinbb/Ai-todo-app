"use client";

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";
import NextBtn from "@/components/icons/myPage/NextBtn";

type PropTypes = {
  user_id: string;
};

const TodoProgressBar = ({ user_id }: PropTypes) => {
  const chartRef = useRef<HTMLCanvasElement & { chart?: Chart }>(null);
  const [totalTodo, setTotalTodo] = useState<number>();
  const [doneTodo, setDoneTodo] = useState<number>();

  const getTodos = async () => {
    const response = await fetch(`/api/myPage/todoProgressBar/${user_id}`);
    if (response.ok) {
      const { total, done } = await response.json();
      setTotalTodo(total);
      setDoneTodo(done);
    }
  };

  useEffect(() => {
    getTodos();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d") as CanvasRenderingContext2D;

      const total = totalTodo as number;
      const done = doneTodo as number;

      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: ["Todo"],
          datasets: [
            {
              label: "완료!",
              data: [(done / total) * 100],
              backgroundColor: ["#5B4DFF"],
              barThickness: 20,
              borderRadius: 10,
              stack: "stack1"
            },
            {
              label: "남은 투두",
              data: [100 - (done / total) * 100],
              backgroundColor: ["#ffffff"],
              barThickness: 20,
              borderRadius: 10,
              stack: "stack1"
            }
          ]
        },
        options: {
          responsive: true,
          indexAxis: "y",
          scales: {
            x: {
              beginAtZero: true,
              max: 100,
              ticks: {
                display: false // x축 라벨 숨기기
              },
              border: {
                display: false // x축 경계선 숨기기
              },
              grid: {
                display: false // x축 그리드 라인 숨기기
              }
            },
            y: {
              type: "category",
              ticks: {
                display: false // y축 라벨 숨기기
              },
              border: {
                display: false // y축 경계선 숨기기
              },
              grid: {
                display: false // y축 그리드 라인 숨기기
              }
            }
          },
          plugins: {
            legend: {
              display: false // 레전드 숨김
            }
            // tooltip: {
            //   enabled: false // 툴팁 비활성화
            // }
          }
          //   elements: {
          //     bar: {
          //       borderRadius: 10
          //     }
          //   }
        }
      });
      chartRef.current.chart = newChart;
    }
    // eslint-disable-next-line
  }, [totalTodo, doneTodo]);

  return (
    <div className="flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[166px] mt-10 bg-system-white border-2 border-grayTrans-30080 rounded-[32px]">
      {totalTodo === 0 ? (
        <>
          <div className="flex flex-col">
            <div>
              <h1 className="min-w-[200px] leading-7 font-bold text-base text-gray-400">
                아직 작성된 투두리스트가 없어요
              </h1>
              <h3 className="min-w-[200px] leading-7 font-medium text-sm text-gray-400">
                투두리스트를 만들러 가볼까요?
              </h3>
            </div>
            <div className="absolute right-5">
              <NextBtn />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px] text-center text-gray-100">
              투두바
            </div>
            <h3 className="text-right text-sm font-bold leading-5 text-gray-400">- / -</h3>
          </div>
        </>
      ) : (
        <canvas ref={chartRef} />
      )}
    </div>
  );
};

export default TodoProgressBar;
