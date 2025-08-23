import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          role: 'customer' | 'vendor' | 'admin';
          phone: string | null;
          avatar_url: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          role: 'customer' | 'vendor' | 'admin';
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          role?: 'customer' | 'vendor' | 'admin';
          phone?: string | null;
          avatar_url?: string | null;
          created_at?: string;
        };
      };
      vendor_profiles: {
        Row: {
          id: string;
          company_name: string;
          category: 'venue' | 'catering' | 'decoration' | 'photography' | 'car_rental';
          description: string | null;
          service_area: string | null;
          base_price: number | null;
          status: 'pending' | 'approved' | 'rejected';
          rejection_reason: string | null;
          rating_avg: number;
          rating_count: number;
          created_at: string;
        };
        Insert: {
          id: string;
          company_name: string;
          category: 'venue' | 'catering' | 'decoration' | 'photography' | 'car_rental';
          description?: string | null;
          service_area?: string | null;
          base_price?: number | null;
          status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          company_name?: string;
          category?: 'venue' | 'catering' | 'decoration' | 'photography' | 'car_rental';
          description?: string | null;
          service_area?: string | null;
          base_price?: number | null;
          status?: 'pending' | 'approved' | 'rejected';
          rejection_reason?: string | null;
          rating_avg?: number;
          rating_count?: number;
          created_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          organizer_id: string;
          title: string;
          description: string | null;
          event_date: string;
          location_text: string | null;
          budget: number | null;
          status: 'draft' | 'published' | 'completed' | 'cancelled';
          created_at: string;
        };
        Insert: {
          id?: string;
          organizer_id: string;
          title: string;
          description?: string | null;
          event_date: string;
          location_text?: string | null;
          budget?: number | null;
          status?: 'draft' | 'published' | 'completed' | 'cancelled';
          created_at?: string;
        };
        Update: {
          id?: string;
          organizer_id?: string;
          title?: string;
          description?: string | null;
          event_date?: string;
          location_text?: string | null;
          budget?: number | null;
          status?: 'draft' | 'published' | 'completed' | 'cancelled';
          created_at?: string;
        };
      };
      event_guests: {
        Row: {
          id: string;
          event_id: string;
          full_name: string;
          email: string | null;
          phone: string | null;
          rsvp_status: 'pending' | 'yes' | 'maybe' | 'no';
          qr_token: string;
          checked_in: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          full_name: string;
          email?: string | null;
          phone?: string | null;
          rsvp_status?: 'pending' | 'yes' | 'maybe' | 'no';
          qr_token?: string;
          checked_in?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          full_name?: string;
          email?: string | null;
          phone?: string | null;
          rsvp_status?: 'pending' | 'yes' | 'maybe' | 'no';
          qr_token?: string;
          checked_in?: boolean;
          created_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          event_id: string | null;
          customer_id: string;
          vendor_id: string;
          service_id: string | null;
          status: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
          scheduled_at: string | null;
          amount: number | null;
          payment_status: 'unpaid' | 'paid' | 'refunded';
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id?: string | null;
          customer_id: string;
          vendor_id: string;
          service_id?: string | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
          scheduled_at?: string | null;
          amount?: number | null;
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string | null;
          customer_id?: string;
          vendor_id?: string;
          service_id?: string | null;
          status?: 'pending' | 'accepted' | 'rejected' | 'cancelled' | 'completed';
          scheduled_at?: string | null;
          amount?: number | null;
          payment_status?: 'unpaid' | 'paid' | 'refunded';
          created_at?: string;
        };
      };
      threads: {
        Row: {
          id: string;
          kind: 'customer_vendor' | 'event_vendor';
          customer_id: string;
          vendor_id: string;
          event_id: string | null;
          last_message_at: string | null;
        };
        Insert: {
          id?: string;
          kind: 'customer_vendor' | 'event_vendor';
          customer_id: string;
          vendor_id: string;
          event_id?: string | null;
          last_message_at?: string | null;
        };
        Update: {
          id?: string;
          kind?: 'customer_vendor' | 'event_vendor';
          customer_id?: string;
          vendor_id?: string;
          event_id?: string | null;
          last_message_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          thread_id: string;
          sender_id: string;
          content: string;
          type: 'text' | 'image';
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          sender_id: string;
          content: string;
          type?: 'text' | 'image';
          created_at?: string;
        };
        Update: {
          id?: string;
          thread_id?: string;
          sender_id?: string;
          content?: string;
          type?: 'text' | 'image';
          created_at?: string;
        };
      };
    };
  };
};