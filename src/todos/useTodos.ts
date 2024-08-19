import { supabase } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Todo } from "./types";

const fetchTodos = async (user_id: string): Promise<Todo[]> => {
  const { data, error } = await supabase
    .from("todos")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
};

const addTodo = async (todo: Partial<Todo>): Promise<Todo> => {
  const { data, error } = await supabase.from("todos").insert(todo).select().single();
  if (error) throw new Error(error.message);
  return data as Todo;
};

const updateTodo = async (todo: Partial<Todo>): Promise<Todo> => {
  const { data, error } = await supabase.from("todos").update(todo).eq("todo_id", todo.todo_id!!).select().single();
  if (error) throw new Error(error.message);
  return data as Todo;
};

const deleteTodo = async (todo_id: string): Promise<void> => {
  const { error } = await supabase.from("todos").delete().eq("todo_id", todo_id);
  if (error) throw new Error(error.message);
};

// 투두 CRUD용 커스텀 훅입니다.
export const useTodos = (user_id: string) => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery<Todo[], Error>({
    queryKey: ["todos", user_id],
    queryFn: () => fetchTodos(user_id)
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", user_id] });
    }
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", user_id] });
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos", user_id] });
    }
  });

  return {
    todosQuery,
    addTodo: addTodoMutation.mutateAsync,
    updateTodo: updateTodoMutation.mutateAsync,
    deleteTodo: deleteTodoMutation.mutateAsync
  };
};
