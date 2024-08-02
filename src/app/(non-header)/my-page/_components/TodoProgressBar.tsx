"use client";

import { useEffect, useRef, useState } from "react";
import { Chart } from "chart.js/auto";

type PropTypes = {
  email: string;
};

const TodoProgressBar = ({ email }: PropTypes) => {
  const chartRef = useRef<HTMLCanvasElement & { chart?: Chart }>(null);
  const [totalTodo, setTotalTodo] = useState<number>();
  const [doneTodo, setDoneTodo] = useState<number>();

  const getTodos = async () => {
    const response = await fetch(`/api/myPage/todoProgressBar/${email}`);
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

  return <div>{totalTodo === 0 ? <h1>오늘의 투두를 등록해보세요!</h1> : <canvas ref={chartRef} />}</div>;
};

export default TodoProgressBar;
