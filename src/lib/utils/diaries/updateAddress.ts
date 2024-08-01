import { TodoListType } from "@/types/diary.type";
import { useRouter } from "next/navigation";

const updateAddress = (todo: TodoListType, route: ReturnType<typeof useRouter>) => {
  if (todo.address && todo.address.lat && todo.address.lng && (todo.address.lat !== 0 || todo.address.lng !== 0)) {
    route.push(`/diary/diary-map/${todo.todo_id}?lat=${todo.address.lat}&lng=${todo.address.lng}`);
  } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        route.push(`/diary/diary-map/${todo.todo_id}?lat=${latitude}&lng=${longitude}`);
      },
      (error) => {
        console.error("Failed to get location", error);
      }
    );
  }
};

export default updateAddress
