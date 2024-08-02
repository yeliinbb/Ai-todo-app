import { useState } from 'react';
import { useTodos } from '../useTodos';
import { Todo } from '../types';
import DatePicker from 'react-datepicker';
import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';

const TodoForm = () => {
  const { addTodo } = useTodos();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [eventDatetime, setEventDatetime] = useState<Date | null>(null);
  const [address, setAddress] = useState<string>("")
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const newTodo: Omit<Todo, "todo_id" | "create_at"> = { todo_title: title, todo_description: description, event_datetime: eventDatetime, address };
    // addTodo(newTodo);
    setTitle("");
    setDescription("");
    setEventDatetime(null);
    setAddress("");
  };

  return (
    <div>
      <div>{dayjs().format("YYYY년 M월 D일 ddd요일")}</div>
      <form onSubmit={handleSubmit}>
        <ul>
          <li>
            <input
              type="text"
              placeholder="제목을 입력해주세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </li>
          <li>
            <textarea
            placeholder="메모"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </li>
          <li>
            <DatePicker />
          </li>
          <li><span onClick={() => router.push("/dairy")}>장소 선택</span></li>
          {/* <li>
            <span>5분 전</span>
            <span>10분 전</span>
            <span>15분 전</span>
            <span>30분 전</span>
          </li> */}
        </ul>
        <button type="submit">추가하기</button>
      </form>
    </div>
  );
};

export default TodoForm;
