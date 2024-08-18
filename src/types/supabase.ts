export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      chat_sessions: {
        Row: {
          ai_type: string | null
          created_at: string
          messages: Json | null
          session_id: string
          summary: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          ai_type?: string | null
          created_at?: string
          messages?: Json | null
          session_id?: string
          summary?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          ai_type?: string | null
          created_at?: string
          messages?: Json | null
          session_id?: string
          summary?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      diaries: {
        Row: {
          content: Json | null
          created_at: string
          diary_id: string
          user_auth: string | null
          user_id: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          diary_id?: string
          user_auth?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          diary_id?: string
          user_auth?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "diaries_user_auth_fkey"
            columns: ["user_auth"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      feedback: {
        Row: {
          content: string | null
          created_at: string
          feedback_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          feedback_id?: string
        }
        Update: {
          content?: string | null
          created_at?: string
          feedback_id?: string
        }
        Relationships: []
      }
      todos: {
        Row: {
          address: Json | null
          created_at: string
          event_datetime: string | null
          is_all_day_event: boolean | null
          is_chat: boolean | null
          is_done: boolean | null
          todo_description: string | null
          todo_id: string
          todo_title: string | null
          user_id: string | null
        }
        Insert: {
          address?: Json | null
          created_at?: string
          event_datetime?: string | null
          is_all_day_event?: boolean | null
          is_chat?: boolean | null
          is_done?: boolean | null
          todo_description?: string | null
          todo_id?: string
          todo_title?: string | null
          user_id?: string | null
        }
        Update: {
          address?: Json | null
          created_at?: string
          event_datetime?: string | null
          is_all_day_event?: boolean | null
          is_chat?: boolean | null
          is_done?: boolean | null
          todo_description?: string | null
          todo_id?: string
          todo_title?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "todos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          isOAuth: boolean
          nickname: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          isOAuth: boolean
          nickname: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          isOAuth?: boolean
          nickname?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
