/*
  # Create Initial Schema for Sambukila 4.0

  1. New Tables
    - `profiles` - User profiles with roles
    - `vendor_profiles` - Vendor-specific information and validation
    - `vendor_media` - Media files for vendor portfolios
    - `services` - Services offered by vendors
    - `events` - Customer events
    - `event_guests` - Guest list with QR codes and RSVP
    - `invitations` - Digital invitations sent to guests
    - `bookings` - Reservations between customers and vendors
    - `threads` - Chat conversation threads
    - `messages` - Chat messages
    - `reviews` - Customer reviews for completed bookings
    - `payments` - Payment records

  2. Security
    - Enable RLS on all tables
    - Add comprehensive policies for role-based access
    - Secure chat and booking interactions

  3. Triggers and Functions
    - Auto-create profile on user signup
    - Generate unique QR tokens for guests
    - Update vendor ratings on review changes
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'vendor', 'admin');
CREATE TYPE vendor_category AS ENUM ('venue', 'catering', 'decoration', 'photography', 'car_rental');
CREATE TYPE vendor_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE event_status AS ENUM ('draft', 'published', 'completed', 'cancelled');
CREATE TYPE rsvp_status AS ENUM ('pending', 'yes', 'maybe', 'no');
CREATE TYPE booking_status AS ENUM ('pending', 'accepted', 'rejected', 'cancelled', 'completed');
CREATE TYPE payment_status AS ENUM ('unpaid', 'paid', 'refunded');
CREATE TYPE thread_kind AS ENUM ('customer_vendor', 'event_vendor');
CREATE TYPE message_type AS ENUM ('text', 'image');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text,
  role user_role NOT NULL DEFAULT 'customer',
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now()
);

-- Create vendor_profiles table
CREATE TABLE IF NOT EXISTS vendor_profiles (
  id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  category vendor_category NOT NULL,
  description text,
  service_area text,
  base_price numeric,
  status vendor_status DEFAULT 'pending',
  rejection_reason text,
  rating_avg numeric DEFAULT 0,
  rating_count integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create vendor_media table
CREATE TABLE IF NOT EXISTS vendor_media (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  file_url text NOT NULL,
  kind text DEFAULT 'image',
  created_at timestamptz DEFAULT now()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  price_from numeric,
  duration_hint text,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organizer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  event_date timestamptz NOT NULL,
  location_text text,
  budget numeric,
  status event_status DEFAULT 'draft',
  created_at timestamptz DEFAULT now()
);

-- Create event_guests table
CREATE TABLE IF NOT EXISTS event_guests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text,
  phone text,
  rsvp_status rsvp_status DEFAULT 'pending',
  qr_token uuid UNIQUE DEFAULT gen_random_uuid(),
  checked_in boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create invitations table
CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE CASCADE,
  guest_id uuid REFERENCES event_guests(id) ON DELETE CASCADE,
  template_key text DEFAULT 'default',
  message text,
  share_link text,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  service_id uuid REFERENCES services(id) ON DELETE SET NULL,
  status booking_status DEFAULT 'pending',
  scheduled_at timestamptz,
  amount numeric,
  payment_status payment_status DEFAULT 'unpaid',
  created_at timestamptz DEFAULT now()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind thread_kind NOT NULL,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  event_id uuid REFERENCES events(id) ON DELETE SET NULL,
  last_message_at timestamptz
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id uuid REFERENCES threads(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  type message_type DEFAULT 'text',
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  vendor_id uuid REFERENCES vendor_profiles(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(booking_id)
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid REFERENCES bookings(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  provider text DEFAULT 'stripe',
  provider_intent_id text,
  status text DEFAULT 'requires_action',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for vendor_profiles
CREATE POLICY "Vendors can manage own profile"
  ON vendor_profiles
  FOR ALL
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Customers can view approved vendors"
  ON vendor_profiles
  FOR SELECT
  TO authenticated
  USING (
    status = 'approved' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'customer'
    )
  );

CREATE POLICY "Admins can manage all vendor profiles"
  ON vendor_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create RLS policies for vendor_media
CREATE POLICY "Vendor can manage own media"
  ON vendor_media
  FOR ALL
  TO authenticated
  USING (
    vendor_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM vendor_profiles vp
      JOIN profiles p ON p.id = auth.uid()
      WHERE vp.id = vendor_id AND vp.status = 'approved' AND p.role = 'customer'
    )
  );

-- Create RLS policies for services
CREATE POLICY "Vendor can manage own services"
  ON services
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendor_profiles 
      WHERE id = vendor_id AND id = auth.uid()
    )
  );

CREATE POLICY "Customers can view approved vendor services"
  ON services
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM vendor_profiles vp
      JOIN profiles p ON p.id = auth.uid()
      WHERE vp.id = vendor_id AND vp.status = 'approved' AND p.role = 'customer'
    )
  );

-- Create RLS policies for events
CREATE POLICY "Users can manage own events"
  ON events
  FOR ALL
  TO authenticated
  USING (organizer_id = auth.uid());

-- Create RLS policies for event_guests
CREATE POLICY "Event organizer can manage guests"
  ON event_guests
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

-- Create RLS policies for invitations
CREATE POLICY "Event organizer can manage invitations"
  ON invitations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE id = event_id AND organizer_id = auth.uid()
    )
  );

-- Create RLS policies for bookings
CREATE POLICY "Customers can manage own bookings"
  ON bookings
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid());

CREATE POLICY "Vendors can view and update their bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (vendor_id = auth.uid());

CREATE POLICY "Vendors can update their booking status"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (vendor_id = auth.uid());

-- Create RLS policies for threads
CREATE POLICY "Thread participants can access"
  ON threads
  FOR ALL
  TO authenticated
  USING (customer_id = auth.uid() OR vendor_id = auth.uid());

-- Create RLS policies for messages
CREATE POLICY "Thread participants can access messages"
  ON messages
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM threads 
      WHERE id = thread_id AND (customer_id = auth.uid() OR vendor_id = auth.uid())
    )
  );

-- Create RLS policies for reviews
CREATE POLICY "Customers can create reviews for completed bookings"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    customer_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id AND customer_id = auth.uid() AND status = 'completed'
    )
  );

CREATE POLICY "Reviews are publicly readable"
  ON reviews
  FOR SELECT
  TO authenticated
  USING (true);

-- Create RLS policies for payments
CREATE POLICY "Booking participants can view payments"
  ON payments
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM bookings 
      WHERE id = booking_id AND (customer_id = auth.uid() OR vendor_id = auth.uid())
    )
  );

-- Function to handle new user signups
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'customer')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Function to update vendor ratings
CREATE OR REPLACE FUNCTION update_vendor_rating()
RETURNS trigger AS $$
BEGIN
  -- Update rating_avg and rating_count for the vendor
  UPDATE vendor_profiles
  SET 
    rating_avg = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews 
      WHERE vendor_id = NEW.vendor_id
    ),
    rating_count = (
      SELECT COUNT(*)
      FROM reviews 
      WHERE vendor_id = NEW.vendor_id
    )
  WHERE id = NEW.vendor_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for rating updates
DROP TRIGGER IF EXISTS on_review_created ON reviews;
CREATE TRIGGER on_review_created
  AFTER INSERT ON reviews
  FOR EACH ROW EXECUTE FUNCTION update_vendor_rating();

-- Function to update thread last message timestamp
CREATE OR REPLACE FUNCTION update_thread_timestamp()
RETURNS trigger AS $$
BEGIN
  UPDATE threads
  SET last_message_at = NEW.created_at
  WHERE id = NEW.thread_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for message timestamp updates
DROP TRIGGER IF EXISTS on_message_created ON messages;
CREATE TRIGGER on_message_created
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_thread_timestamp();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_status ON vendor_profiles(status);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_category ON vendor_profiles(category);
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_event_guests_qr_token ON event_guests(qr_token);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor ON bookings(vendor_id);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(thread_id);
CREATE INDEX IF NOT EXISTS idx_threads_participants ON threads(customer_id, vendor_id);