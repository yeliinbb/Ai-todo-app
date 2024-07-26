import { TodoType } from "@/types/todo.type";
import { supabase } from "@/utils/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const fetchTodos = async (): Promise<TodoType[]> => {
  const { data, error } = await supabase.from<TodoType>("todos").select("*");
  if (error) throw new Error(error.message);
  return data ?? [];
};

export const addTodo = async (todo: Omit<TodoType, "todo_id">): Promise<TodoType> => {
  const { data, error } = await supabase.from<TodoType>("todos").insert(todo).select().single();
  if (error) throw new Error(error.message);
  return data as TodoType;
};

export const updateTodo = async (todo: TodoType): Promise<TodoType> => {
  const { data, error } = await supabase
    .from<TodoType>("todos")
    .update(todo)
    .eq("todo_id", todo.todo_id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as TodoType;
};

export const deleteTodo = async (todo_id: string): Promise<void> => {
  const { error } = await supabase.from<TodoType>("todos").delete().eq("todo_id", todo_id);
  if (error) throw new Error(error.message);
};

export const useTodos = () => {
  const queryClient = useQueryClient();

  const todosQuery = useQuery({
    queryKey: ["todos"],
    queryFn: fetchTodos
  });

  const addTodoMutation = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });

  const updateTodoMutation = useMutation({
    mutationFn: updateTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    }
  });

  return {
    todosQuery,
    addTodo: addTodoMutation.mutate,
    updateTodo: updateTodoMutation.mutate,
    deleteTodo: deleteTodoMutation.mutate
  };
};
