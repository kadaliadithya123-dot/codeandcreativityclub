export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      club_events: {
        Row: {
          audience: string
          created_at: string
          event_date: string
          event_time: string
          highlights: Json
          id: string
          kind: string
          photos: Json
          poster_url: string | null
          published: boolean
          resource_persons: Json
          sort_order: number
          summary: Json
          title: string
          updated_at: string
          venue: string
        }
        Insert: {
          audience?: string
          created_at?: string
          event_date?: string
          event_time?: string
          highlights?: Json
          id?: string
          kind?: string
          photos?: Json
          poster_url?: string | null
          published?: boolean
          resource_persons?: Json
          sort_order?: number
          summary?: Json
          title: string
          updated_at?: string
          venue?: string
        }
        Update: {
          audience?: string
          created_at?: string
          event_date?: string
          event_time?: string
          highlights?: Json
          id?: string
          kind?: string
          photos?: Json
          poster_url?: string | null
          published?: boolean
          resource_persons?: Json
          sort_order?: number
          summary?: Json
          title?: string
          updated_at?: string
          venue?: string
        }
        Relationships: []
      }
      club_members: {
        Row: {
          created_at: string
          email: string
          featured: boolean
          id: string
          name: string
          phone: string
          photo_url: string | null
          pin: string
          published: boolean
          role_title: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string
          featured?: boolean
          id?: string
          name: string
          phone?: string
          photo_url?: string | null
          pin?: string
          published?: boolean
          role_title?: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          featured?: boolean
          id?: string
          name?: string
          phone?: string
          photo_url?: string | null
          pin?: string
          published?: boolean
          role_title?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      questions: {
        Row: {
          correct_answer: string
          created_at: string
          created_by: string | null
          department: string
          difficulty: string
          explanation: string | null
          id: string
          marks: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          section: string
          subject: string
          updated_at: string
          year: string
        }
        Insert: {
          correct_answer: string
          created_at?: string
          created_by?: string | null
          department: string
          difficulty?: string
          explanation?: string | null
          id?: string
          marks?: number
          option_a: string
          option_b: string
          option_c: string
          option_d: string
          question: string
          section: string
          subject: string
          updated_at?: string
          year: string
        }
        Update: {
          correct_answer?: string
          created_at?: string
          created_by?: string | null
          department?: string
          difficulty?: string
          explanation?: string | null
          id?: string
          marks?: number
          option_a?: string
          option_b?: string
          option_c?: string
          option_d?: string
          question?: string
          section?: string
          subject?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      results: {
        Row: {
          answers: Json
          correct: number
          id: string
          percentage: number
          score: number
          student_id: string
          submitted_at: string
          test_id: string
          time_taken_seconds: number
          total_marks: number
          wrong: number
        }
        Insert: {
          answers?: Json
          correct?: number
          id?: string
          percentage?: number
          score?: number
          student_id: string
          submitted_at?: string
          test_id: string
          time_taken_seconds?: number
          total_marks?: number
          wrong?: number
        }
        Update: {
          answers?: Json
          correct?: number
          id?: string
          percentage?: number
          score?: number
          student_id?: string
          submitted_at?: string
          test_id?: string
          time_taken_seconds?: number
          total_marks?: number
          wrong?: number
        }
        Relationships: [
          {
            foreignKeyName: "results_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "results_test_id_fkey"
            columns: ["test_id"]
            isOneToOne: false
            referencedRelation: "tests"
            referencedColumns: ["id"]
          },
        ]
      }
      site_content: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      students: {
        Row: {
          created_at: string
          department: string
          hall_ticket: string
          id: string
          name: string
          section: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          department: string
          hall_ticket: string
          id?: string
          name: string
          section: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          department?: string
          hall_ticket?: string
          id?: string
          name?: string
          section?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      tests: {
        Row: {
          created_at: string
          created_by: string | null
          department: string
          duration_minutes: number
          id: string
          question_count: number
          section: string
          shuffle_options: boolean
          shuffle_questions: boolean
          status: string
          subject: string
          title: string
          updated_at: string
          year: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          department: string
          duration_minutes?: number
          id?: string
          question_count?: number
          section: string
          shuffle_options?: boolean
          shuffle_questions?: boolean
          status?: string
          subject: string
          title: string
          updated_at?: string
          year: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          department?: string
          duration_minutes?: number
          id?: string
          question_count?: number
          section?: string
          shuffle_options?: boolean
          shuffle_questions?: boolean
          status?: string
          subject?: string
          title?: string
          updated_at?: string
          year?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      club_members_public: {
        Row: {
          created_at: string | null
          featured: boolean | null
          id: string | null
          name: string | null
          photo_url: string | null
          published: boolean | null
          role_title: string | null
          sort_order: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          featured?: boolean | null
          id?: string | null
          name?: string | null
          photo_url?: string | null
          published?: boolean | null
          role_title?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          featured?: boolean | null
          id?: string | null
          name?: string | null
          photo_url?: string | null
          published?: boolean | null
          role_title?: string | null
          sort_order?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "faculty"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "faculty"],
    },
  },
} as const
