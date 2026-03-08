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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      admin_reviews: {
        Row: {
          action: string
          business_id: string
          comments: string | null
          created_at: string
          id: string
          reviewer_id: string
        }
        Insert: {
          action: string
          business_id: string
          comments?: string | null
          created_at?: string
          id?: string
          reviewer_id: string
        }
        Update: {
          action?: string
          business_id?: string
          comments?: string | null
          created_at?: string
          id?: string
          reviewer_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_reviews_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_documents: {
        Row: {
          business_id: string
          document_type: string
          file_name: string | null
          file_url: string
          id: string
          uploaded_at: string
        }
        Insert: {
          business_id: string
          document_type: string
          file_name?: string | null
          file_url: string
          id?: string
          uploaded_at?: string
        }
        Update: {
          business_id?: string
          document_type?: string
          file_name?: string | null
          file_url?: string
          id?: string
          uploaded_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_documents_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      business_team_members: {
        Row: {
          bio: string | null
          business_id: string
          created_at: string
          id: string
          linkedin_url: string | null
          name: string
          role: string | null
        }
        Insert: {
          bio?: string | null
          business_id: string
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name: string
          role?: string | null
        }
        Update: {
          bio?: string | null
          business_id?: string
          created_at?: string
          id?: string
          linkedin_url?: string | null
          name?: string
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "business_team_members_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      businesses: {
        Row: {
          admin_feedback: string | null
          competitive_advantage: string | null
          created_at: string
          current_revenue: number | null
          description: string | null
          featured: boolean
          financial_projection: string | null
          founded_year: number | null
          funded_amount: number | null
          funding_goal: number | null
          growth_rate: number | null
          id: string
          industry: string | null
          location: string | null
          logo_url: string | null
          max_investment: number | null
          min_investment: number | null
          name: string
          owner_id: string
          payout_frequency: string | null
          pitch: string | null
          problem_solved: string | null
          profit_margin: number | null
          region: string | null
          revenue_share_pct: number | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["business_status"]
          target_market: string | null
          updated_at: string
          website: string | null
        }
        Insert: {
          admin_feedback?: string | null
          competitive_advantage?: string | null
          created_at?: string
          current_revenue?: number | null
          description?: string | null
          featured?: boolean
          financial_projection?: string | null
          founded_year?: number | null
          funded_amount?: number | null
          funding_goal?: number | null
          growth_rate?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          max_investment?: number | null
          min_investment?: number | null
          name: string
          owner_id: string
          payout_frequency?: string | null
          pitch?: string | null
          problem_solved?: string | null
          profit_margin?: number | null
          region?: string | null
          revenue_share_pct?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["business_status"]
          target_market?: string | null
          updated_at?: string
          website?: string | null
        }
        Update: {
          admin_feedback?: string | null
          competitive_advantage?: string | null
          created_at?: string
          current_revenue?: number | null
          description?: string | null
          featured?: boolean
          financial_projection?: string | null
          founded_year?: number | null
          funded_amount?: number | null
          funding_goal?: number | null
          growth_rate?: number | null
          id?: string
          industry?: string | null
          location?: string | null
          logo_url?: string | null
          max_investment?: number | null
          min_investment?: number | null
          name?: string
          owner_id?: string
          payout_frequency?: string | null
          pitch?: string | null
          problem_solved?: string | null
          profit_margin?: number | null
          region?: string | null
          revenue_share_pct?: number | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["business_status"]
          target_market?: string | null
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      investment_tiers: {
        Row: {
          business_id: string
          created_at: string
          id: string
          min_amount: number
          name: string
          payout_frequency: string | null
          revenue_share_pct: number
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          min_amount: number
          name: string
          payout_frequency?: string | null
          revenue_share_pct: number
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          min_amount?: number
          name?: string
          payout_frequency?: string | null
          revenue_share_pct?: number
        }
        Relationships: [
          {
            foreignKeyName: "investment_tiers_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          admin_payment_note: string | null
          amount: number
          business_id: string
          created_at: string
          id: string
          invested_at: string
          investor_id: string
          payment_method: string | null
          payment_proof_url: string | null
          payment_reviewed_at: string | null
          payment_reviewed_by: string | null
          revenue_share_pct: number
          status: string
          tier_id: string | null
        }
        Insert: {
          admin_payment_note?: string | null
          amount: number
          business_id: string
          created_at?: string
          id?: string
          invested_at?: string
          investor_id: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_reviewed_at?: string | null
          payment_reviewed_by?: string | null
          revenue_share_pct: number
          status?: string
          tier_id?: string | null
        }
        Update: {
          admin_payment_note?: string | null
          amount?: number
          business_id?: string
          created_at?: string
          id?: string
          invested_at?: string
          investor_id?: string
          payment_method?: string | null
          payment_proof_url?: string | null
          payment_reviewed_at?: string | null
          payment_reviewed_by?: string | null
          revenue_share_pct?: number
          status?: string
          tier_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "investments_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "investments_tier_id_fkey"
            columns: ["tier_id"]
            isOneToOne: false
            referencedRelation: "investment_tiers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string | null
          read: boolean | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          read?: boolean | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_methods: {
        Row: {
          account_name: string
          account_number: string
          bank_name: string
          branch_name: string | null
          created_at: string
          created_by: string | null
          id: string
          instructions: string | null
          is_active: boolean
          routing_number: string | null
          swift_code: string | null
          updated_at: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_name: string
          branch_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          routing_number?: string | null
          swift_code?: string | null
          updated_at?: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_name?: string
          branch_name?: string | null
          created_at?: string
          created_by?: string | null
          id?: string
          instructions?: string | null
          is_active?: boolean
          routing_number?: string | null
          swift_code?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
          user_id?: string
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
      watchlists: {
        Row: {
          business_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          business_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          business_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watchlists_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "businesses"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "investor" | "business_owner"
      business_status:
        | "draft"
        | "pending"
        | "under_review"
        | "approved"
        | "rejected"
        | "suspended"
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
      app_role: ["admin", "investor", "business_owner"],
      business_status: [
        "draft",
        "pending",
        "under_review",
        "approved",
        "rejected",
        "suspended",
      ],
    },
  },
} as const
