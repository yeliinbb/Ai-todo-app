import TodoListPage from "@/todos/components/TodoListPage";

const Page = () => {
  return (
    <>
      <TodoListPage />
      {/* NavBar만큼 아래 공간 띄우기용 div */}
      {/* <div className="h-20 bg-system-white w-full"></div> */}
    </>
  );
};

export default Page;
