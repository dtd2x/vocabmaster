export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          display_name: string | null
          avatar_url: string | null
          native_language: string
          daily_new_cards_limit: number
          daily_review_limit: number
          timezone: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          display_name?: string | null
          avatar_url?: string | null
          native_language?: string
          daily_new_cards_limit?: number
          daily_review_limit?: number
          timezone?: string
        }
        Update: {
          display_name?: string | null
          avatar_url?: string | null
          native_language?: string
          daily_new_cards_limit?: number
          daily_review_limit?: number
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
      decks: {
        Row: {
          id: string
          user_id: string | null
          name: string
          description: string | null
          cover_image_url: string | null
          is_preset: boolean
          is_public: boolean
          category: string | null
          card_count: number
          language: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          name: string
          description?: string | null
          cover_image_url?: string | null
          is_preset?: boolean
          is_public?: boolean
          category?: string | null
          card_count?: number
          language?: string
        }
        Update: {
          name?: string
          description?: string | null
          cover_image_url?: string | null
          is_public?: boolean
          category?: string | null
          card_count?: number
          language?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "decks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      cards: {
        Row: {
          id: string
          deck_id: string
          front: string
          back: string
          example_sentence: string | null
          pronunciation: string | null
          audio_url: string | null
          image_url: string | null
          tags: string[] | null
          extra_fields: Record<string, unknown> | null
          position: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          deck_id: string
          front: string
          back: string
          example_sentence?: string | null
          pronunciation?: string | null
          audio_url?: string | null
          image_url?: string | null
          tags?: string[] | null
          extra_fields?: Record<string, unknown> | null
          position?: number
        }
        Update: {
          deck_id?: string
          front?: string
          back?: string
          example_sentence?: string | null
          pronunciation?: string | null
          audio_url?: string | null
          image_url?: string | null
          tags?: string[] | null
          extra_fields?: Record<string, unknown> | null
          position?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "cards_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          }
        ]
      }
      card_progress: {
        Row: {
          id: string
          user_id: string
          card_id: string
          ease_factor: number
          interval: number
          repetitions: number
          next_review: string
          last_reviewed: string | null
          status: 'new' | 'learning' | 'review' | 'graduated'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review?: string
          last_reviewed?: string | null
          status?: 'new' | 'learning' | 'review' | 'graduated'
        }
        Update: {
          ease_factor?: number
          interval?: number
          repetitions?: number
          next_review?: string
          last_reviewed?: string | null
          status?: 'new' | 'learning' | 'review' | 'graduated'
        }
        Relationships: [
          {
            foreignKeyName: "card_progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "card_progress_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          }
        ]
      }
      user_stats: {
        Row: {
          user_id: string
          xp: number
          level: number
          current_streak: number
          longest_streak: number
          last_review_date: string | null
          total_reviews: number
          total_cards_learned: number
          badges: string[]
          daily_goal: number
          updated_at: string
        }
        Insert: {
          user_id: string
          xp?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          last_review_date?: string | null
          total_reviews?: number
          total_cards_learned?: number
          badges?: string[]
          daily_goal?: number
        }
        Update: {
          xp?: number
          level?: number
          current_streak?: number
          longest_streak?: number
          last_review_date?: string | null
          total_reviews?: number
          total_cards_learned?: number
          badges?: string[]
          daily_goal?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      review_logs: {
        Row: {
          id: string
          user_id: string
          card_id: string
          deck_id: string | null
          rating: number
          ease_factor_before: number | null
          ease_factor_after: number | null
          interval_before: number | null
          interval_after: number | null
          review_duration_ms: number | null
          quiz_mode: string
          reviewed_at: string
        }
        Insert: {
          id?: string
          user_id: string
          card_id: string
          deck_id?: string | null
          rating: number
          ease_factor_before?: number | null
          ease_factor_after?: number | null
          interval_before?: number | null
          interval_after?: number | null
          review_duration_ms?: number | null
          quiz_mode?: string
        }
        Update: {
          rating?: number
          ease_factor_before?: number | null
          ease_factor_after?: number | null
          interval_before?: number | null
          interval_after?: number | null
          review_duration_ms?: number | null
          quiz_mode?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_logs_card_id_fkey"
            columns: ["card_id"]
            isOneToOne: false
            referencedRelation: "cards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "review_logs_deck_id_fkey"
            columns: ["deck_id"]
            isOneToOne: false
            referencedRelation: "decks"
            referencedColumns: ["id"]
          }
        ]
      }
      achievements: {
        Row: {
          id: string
          name: string
          description: string
          icon_url: string | null
          xp_reward: number
          condition: Record<string, unknown>
        }
        Insert: {
          id: string
          name: string
          description: string
          icon_url?: string | null
          xp_reward?: number
          condition: Record<string, unknown>
        }
        Update: {
          name?: string
          description?: string
          icon_url?: string | null
          xp_reward?: number
          condition?: Record<string, unknown>
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_review_heatmap: {
        Args: {
          p_user_id: string
          p_days?: number
        }
        Returns: {
          review_date: string
          review_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
