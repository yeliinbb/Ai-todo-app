import { supabase } from "@/utils/supabase/client";
import { Todo } from "@/types/todo.type";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const fetchTodos = async (): Promise<Todo[]> => {
  const { data, error } = await supabase.from("todos").select("*");
  if (error) throw new Error(error.message);
  return data;
};

export const addTodo = async (todo: Omit<Todo, "todo_id">): Promise<Todo> => {
  const { data, error } = await supabase.from("todos").insert(todo).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const { data, error } = await supabase.from("todos").update(todo).eq("todo_id", todo.todo_id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteTodo = async (todo_id: string): Promise<void> => {
  const { data, error } = await supabase.from("todos").delete().eq("todo_id", todo_id);
  if (error) throw new Error(error.message);
  return data;
};

// 커스텀 훅
export const useTodos = () => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery<Todo[], Error>(["todos"], fetchTodos);

  const addTodoMutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  const updateTodoMutation = useMutation(updateTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  const deleteTodoMutation = useMutation(deleteTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries(["todos"]);
    }
  });

  return {
    todosQuery,
    addTodo: addTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate
  };
};
