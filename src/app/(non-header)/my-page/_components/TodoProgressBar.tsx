"use client";

import { useEffect, useRef } from "react";
import { Chart } from "chart.js/auto";
import { getCurrentDate } from "@/lib/utils/getCurrentDate";

type PropTypes = {
  email: string;
};

const TodoProgressBar = ({ email }: PropTypes) => {
  const chartRef = useRef<HTMLCanvasElement & { chart?: Chart }>(null);
  console.log(getCurrentDate());

  useEffect(() => {
    if (chartRef.current) {
      if (chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }

      const context = chartRef.current.getContext("2d") as CanvasRenderingContext2D;
      const totalTodo = 5;
      const doneTodo = 3; // is_done false

      const newChart = new Chart(context, {
        type: "bar",
        data: {
          labels: ["Todo"],
          datasets: [
            {
              label: "완료!",
              data: [(doneTodo / totalTodo) * 100],
              backgroundColor: ["orange"],
              barThickness: 20,
              borderRadius: 10,
              stack: "stack1"
            },
            {
              label: "남은 투두",
              data: [100 - (doneTodo / totalTodo) * 100],
              backgroundColor: ["white"],
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
  }, []);

  return (
    <div>
      <canvas ref={chartRef} />
    </div>
  );
};

export default TodoProgressBar;
