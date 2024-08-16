"use client";

import { useEffect, useState } from "react";
import NothingTodo from "./NothingTodo";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import SkeletonBar from "./SkeletonBar";
import RoundNextBtn from "@/components/icons/myPage/RoundNextBtn";
import RoundNextBigBtn from "@/components/icons/myPage/RoundNextBigBtn";
import TodoListBtn from "@/components/icons/myPage/TodoListBtn";
import TodoListBigBtn from "@/components/icons/myPage/TodoListBigBtn";

type PropTypes = {
  user_id: string;
};

const TodoProgressBar = ({ user_id }: PropTypes) => {
  const [totalTodo, setTotalTodo] = useState<number>();
  const [doneTodo, setDoneTodo] = useState<number>();
  const [baseWidth, setBaseWidth] = useState(window.innerWidth >= 1200 ? 500 : 300);
  const [progressPercentage, setProgressPercentage] = useState<number>();

  const getTodos = async () => {
    const response = await fetch(`/api/myPage/todoProgressBar/${user_id}`);
    if (!response.ok) throw new Error("Failed to fetch todo counts");
    return response.json();
  };

  const { data: todoCount, isPending } = useQuery({
    queryKey: ["todoCounts", user_id],
    queryFn: getTodos,
    staleTime: 0
  });

  useEffect(() => {
    const updateBaseWidth = () => {
      setBaseWidth(window.innerWidth >= 1200 ? 500 : 300);
    };
    if (todoCount) {
      setTotalTodo(todoCount.total);
      setDoneTodo(todoCount.done);
      window.addEventListener("resize", updateBaseWidth);
      setProgressPercentage((todoCount.done / todoCount.total) * 100 * ((baseWidth as number) / 100));
    }
    return () => {
      window.removeEventListener("resize", updateBaseWidth);
    };
    // eslint-disable-next-line
  }, [todoCount, baseWidth]);

  return (
    <>
      {isPending && <SkeletonBar />}
      {totalTodo === 0 ? <NothingTodo /> : null}
      {(totalTodo as number) > 0 && totalTodo !== doneTodo && (
        <div className="desktop:min-w-[580px] desktop:min-h-[248px] desktop:rounded-[52px] desktop:border-4 desktop:p-10 flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[164px] mt-10 bg-system-white border-2 border-paiTrans-40060 rounded-[32px]">
          <div className="flex flex-col">
            <div>
              <h1 className="desktop:text-[22px] desktop:mb-3 min-w-[200px] leading-7 font-bold text-base text-gray-700">
                오늘의 투두는 순항중
              </h1>
              <h3 className="desktop:text-[20px] min-w-[200px] leading-7 font-medium text-sm text-gray-500">
                투두리스트를 확인하러 가볼까요?
              </h3>
            </div>
            <div className="desktop:top-9 desktop:right-10 absolute right-5 text-gray-400">
              <Link href={"/todo-list"}>
                <div className="desktop:hidden block">
                  <RoundNextBtn />
                </div>
                <div className="desktop:block hidden">
                  <RoundNextBigBtn />
                </div>
              </Link>
            </div>
          </div>
          <div className="desktop:mt-9 flex flex-col gap-1">
            <div className="desktop:min-w-[500px] desktop:min-h-[32px] relative min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px]">
              <div
                style={{ width: `${progressPercentage}px` }}
                className={`desktop:min-h-[32px] absolute min-h-[24px] bg-pai-400 rounded-[20px]`}
              ></div>
            </div>
            <div className="flex justify-end text-sm font-bold leading-5 text-gray-400 mr-1">
              <p className="mr-1 text-pai-400">{doneTodo} </p> / {totalTodo}
            </div>
          </div>
        </div>
      )}
      {totalTodo && totalTodo !== 0 && totalTodo === doneTodo ? (
        <div className="desktop:min-w-[580px] desktop:min-h-[248px] desktop:rounded-[52px] desktop:border-4 desktop:p-10 flex flex-col gap-5 relative p-5 min-w-[347px] min-h-[164px] mt-10 bg-system-white border-2 border-pai-400 rounded-[32px]">
          <div className="flex flex-col">
            <div>
              <h1 className="desktop:text-[22px] desktop:mb-3 min-w-[200px] leading-7 font-bold text-base text-gray-700">
                오늘의 투두를 모두 완료했어요!
              </h1>
              <h3 className="desktop:text-[20px] min-w-[200px] leading-7 font-medium text-sm text-gray-500">
                투두리스트를 확인하러 가볼까요?
              </h3>
            </div>
            <div className="desktop:top-9 desktop:right-10 absolute right-5">
              <Link href={"/todo-list"}>
                <div className="desktop:hidden block">
                  <TodoListBtn />
                </div>
                <div className="desktop:block hidden">
                  <TodoListBigBtn />
                </div>
              </Link>
            </div>
          </div>
          <div className="desktop:mt-9 flex flex-col gap-1">
            <div className="desktop:min-w-[500px] desktop:min-h-[32px] relative min-w-[300px] min-h-[24px] bg-gray-100 rounded-[20px]">
              <div
                style={{ width: `${progressPercentage}px` }}
                className={`desktop:min-h-[32px] absolute min-h-[24px] bg-pai-400 rounded-[20px]`}
              ></div>
            </div>
            <div className="flex justify-end text-sm font-bold leading-5 text-gray-400 mr-1">
              <p className="mr-1 text-pai-400">{doneTodo} </p> / {totalTodo}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default TodoProgressBar;
