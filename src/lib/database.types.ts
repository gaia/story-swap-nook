
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          location: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          location?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      books: {
        Row: {
          id: string
          title: string
          author: string
          description: string | null
          cover_url: string | null
          age_range: string | null
          condition: string | null
          owner_id: string
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          author: string
          description?: string | null
          cover_url?: string | null
          age_range?: string | null
          condition?: string | null
          owner_id: string
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          author?: string
          description?: string | null
          cover_url?: string | null
          age_range?: string | null
          condition?: string | null
          owner_id?: string
          status?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      book_exchanges: {
        Row: {
          id: string
          book_id: string
          borrower_id: string
          status: string
          borrow_date: string | null
          return_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          book_id: string
          borrower_id: string
          status?: string
          borrow_date?: string | null
          return_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          book_id?: string
          borrower_id?: string
          status?: string
          borrow_date?: string | null
          return_date?: string | null
          created_at?: string
          updated_at?: string
        }
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
