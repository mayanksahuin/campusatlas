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
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      college_achievements: {
        Row: {
          college_id: string
          created_at: string
          description: string | null
          id: string
          last_verified_at: string | null
          source_id: string | null
          title: string
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          year: number | null
        }
        Insert: {
          college_id: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          source_id?: string | null
          title: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          year?: number | null
        }
        Update: {
          college_id?: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          source_id?: string | null
          title?: string
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "college_achievements_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_achievements_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      college_aliases: {
        Row: {
          alias: string
          college_id: string
          created_at: string
          id: string
        }
        Insert: {
          alias: string
          college_id: string
          created_at?: string
          id?: string
        }
        Update: {
          alias?: string
          college_id?: string
          created_at?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "college_aliases_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      college_clubs: {
        Row: {
          category: string
          college_id: string
          created_at: string
          description: string | null
          id: string
          last_verified_at: string | null
          name: string
          source_id: string | null
          updated_at: string
          url: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          category?: string
          college_id: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          source_id?: string | null
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          category?: string
          college_id?: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          source_id?: string | null
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_clubs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_clubs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      college_departments: {
        Row: {
          college_id: string
          created_at: string
          description: string | null
          id: string
          last_verified_at: string | null
          name: string
          source_id: string | null
          updated_at: string
          url: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          college_id: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          source_id?: string | null
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          college_id?: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          source_id?: string | null
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_departments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_departments_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      college_facilities: {
        Row: {
          category: string
          college_id: string
          created_at: string
          description: string | null
          id: string
          last_verified_at: string | null
          name: string
          source_id: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          category: string
          college_id: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name: string
          source_id?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          category?: string
          college_id?: string
          created_at?: string
          description?: string | null
          id?: string
          last_verified_at?: string | null
          name?: string
          source_id?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_facilities_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_facilities_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      college_programs: {
        Row: {
          college_id: string
          created_at: string
          degree: string
          department: string | null
          duration_years: number | null
          id: string
          intake: number | null
          last_verified_at: string | null
          name: string | null
          source_id: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          college_id: string
          created_at?: string
          degree: string
          department?: string | null
          duration_years?: number | null
          id?: string
          intake?: number | null
          last_verified_at?: string | null
          name?: string | null
          source_id?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          college_id?: string
          created_at?: string
          degree?: string
          department?: string | null
          duration_years?: number | null
          id?: string
          intake?: number | null
          last_verified_at?: string | null
          name?: string | null
          source_id?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_programs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_programs_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      college_research: {
        Row: {
          area: string | null
          college_id: string
          created_at: string
          description: string | null
          id: string
          kind: string
          last_verified_at: string | null
          source_id: string | null
          title: string
          updated_at: string
          url: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          area?: string | null
          college_id: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          last_verified_at?: string | null
          source_id?: string | null
          title: string
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          area?: string | null
          college_id?: string
          created_at?: string
          description?: string | null
          id?: string
          kind?: string
          last_verified_at?: string | null
          source_id?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_research_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_research_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      college_social_links: {
        Row: {
          college_id: string
          created_at: string
          id: string
          is_official: boolean
          last_verified_at: string | null
          platform: string
          updated_at: string
          url: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          college_id: string
          created_at?: string
          id?: string
          is_official?: boolean
          last_verified_at?: string | null
          platform: string
          updated_at?: string
          url: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          college_id?: string
          created_at?: string
          id?: string
          is_official?: boolean
          last_verified_at?: string | null
          platform?: string
          updated_at?: string
          url?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_social_links_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      college_sources: {
        Row: {
          accessed_at: string | null
          college_id: string
          created_at: string
          id: string
          last_verified_at: string | null
          notes: string | null
          publisher: string | null
          source_type: string
          title: string | null
          updated_at: string
          url: string
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          accessed_at?: string | null
          college_id: string
          created_at?: string
          id?: string
          last_verified_at?: string | null
          notes?: string | null
          publisher?: string | null
          source_type?: string
          title?: string | null
          updated_at?: string
          url: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          accessed_at?: string | null
          college_id?: string
          created_at?: string
          id?: string
          last_verified_at?: string | null
          notes?: string | null
          publisher?: string | null
          source_type?: string
          title?: string | null
          updated_at?: string
          url?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_sources_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      college_updates: {
        Row: {
          body: string | null
          college_id: string | null
          created_at: string
          id: string
          last_verified_at: string | null
          published_at: string | null
          source_id: string | null
          title: string
          updated_at: string
          url: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          body?: string | null
          college_id?: string | null
          created_at?: string
          id?: string
          last_verified_at?: string | null
          published_at?: string | null
          source_id?: string | null
          title: string
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          body?: string | null
          college_id?: string | null
          created_at?: string
          id?: string
          last_verified_at?: string | null
          published_at?: string | null
          source_id?: string | null
          title?: string
          updated_at?: string
          url?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "college_updates_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "college_updates_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          affiliation: string | null
          area: string | null
          city: string
          created_at: string
          entrance_routes: string[]
          established_year: number | null
          id: string
          institution_type: string
          last_verified_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          ownership: string
          search: unknown
          slug: string
          state: string
          summary: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website: string | null
        }
        Insert: {
          affiliation?: string | null
          area?: string | null
          city?: string
          created_at?: string
          entrance_routes?: string[]
          established_year?: number | null
          id?: string
          institution_type: string
          last_verified_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          ownership?: string
          search?: unknown
          slug: string
          state?: string
          summary?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
        }
        Update: {
          affiliation?: string | null
          area?: string | null
          city?: string
          created_at?: string
          entrance_routes?: string[]
          established_year?: number | null
          id?: string
          institution_type?: string
          last_verified_at?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          ownership?: string
          search?: unknown
          slug?: string
          state?: string
          summary?: string | null
          updated_at?: string
          verification_status?: Database["public"]["Enums"]["verification_status"]
          website?: string | null
        }
        Relationships: []
      }
      events: {
        Row: {
          college_id: string | null
          created_at: string
          description: string | null
          ends_at: string | null
          event_type: string
          id: string
          last_verified_at: string | null
          registration_url: string | null
          slug: string
          source_id: string | null
          starts_at: string | null
          title: string
          updated_at: string
          venue: string | null
          verification_status: Database["public"]["Enums"]["verification_status"]
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          event_type: string
          id?: string
          last_verified_at?: string | null
          registration_url?: string | null
          slug: string
          source_id?: string | null
          starts_at?: string | null
          title: string
          updated_at?: string
          venue?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Update: {
          college_id?: string | null
          created_at?: string
          description?: string | null
          ends_at?: string | null
          event_type?: string
          id?: string
          last_verified_at?: string | null
          registration_url?: string | null
          slug?: string
          source_id?: string | null
          starts_at?: string | null
          title?: string
          updated_at?: string
          venue?: string | null
          verification_status?: Database["public"]["Enums"]["verification_status"]
        }
        Relationships: [
          {
            foreignKeyName: "events_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "events_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_log: {
        Row: {
          entity_id: string
          entity_table: string
          id: string
          notes: string | null
          source_id: string | null
          status: Database["public"]["Enums"]["verification_status"]
          verified_at: string
        }
        Insert: {
          entity_id: string
          entity_table: string
          id?: string
          notes?: string | null
          source_id?: string | null
          status: Database["public"]["Enums"]["verification_status"]
          verified_at?: string
        }
        Update: {
          entity_id?: string
          entity_table?: string
          id?: string
          notes?: string | null
          source_id?: string | null
          status?: Database["public"]["Enums"]["verification_status"]
          verified_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verification_log_source_id_fkey"
            columns: ["source_id"]
            isOneToOne: false
            referencedRelation: "college_sources"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_colleges: {
        Args: { kind?: string; q?: string }
        Returns: {
          affiliation: string | null
          area: string | null
          city: string
          created_at: string
          entrance_routes: string[]
          established_year: number | null
          id: string
          institution_type: string
          last_verified_at: string | null
          latitude: number | null
          longitude: number | null
          name: string
          ownership: string
          search: unknown
          slug: string
          state: string
          summary: string | null
          updated_at: string
          verification_status: Database["public"]["Enums"]["verification_status"]
          website: string | null
        }[]
        SetofOptions: {
          from: "*"
          to: "colleges"
          isOneToOne: false
          isSetofReturn: true
        }
      }
    }
    Enums: {
      verification_status: "verified" | "partial" | "pending" | "rejected"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      verification_status: ["verified", "partial", "pending", "rejected"],
    },
  },
} as const
