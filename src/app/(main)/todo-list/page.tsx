import TodoListPage from "@/todos/components/TodoListPage";

const Page = () => {
  return (
    <>
      <TodoListPage />
      <div className="h-20 bg-system-white w-full">{/* NavBar만큼 아래 공간 띄우기용 div */}</div>
    </>
  );
};

export default Page;
