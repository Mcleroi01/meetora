/*
  # Seed Initial Data for Sambukila 4.0

  This migration adds sample data for testing and demonstration:
  - Admin user
  - Sample vendors (approved and pending)
  - Sample services
  - Sample customer with events and guests
  - Sample bookings and reviews
*/

-- Insert admin profile (you'll need to create this user first in Supabase Auth)
INSERT INTO profiles (id, full_name, role) VALUES
  ('00000000-0000-0000-0000-000000000001', 'Admin Sambukila', 'admin');

-- Insert sample customer
INSERT INTO profiles (id, full_name, role, phone) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Marie Dupont', 'customer', '+33612345678');

-- Insert sample vendors
INSERT INTO profiles (id, full_name, role, phone) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Château de Versailles Events', 'vendor', '+33612345679'),
  ('33333333-3333-3333-3333-333333333333', 'Delicious Catering', 'vendor', '+33612345680'),
  ('44444444-4444-4444-4444-444444444444', 'PhotoMagic Studio', 'vendor', '+33612345681'),
  ('55555555-5555-5555-5555-555555555555', 'DecorArt', 'vendor', '+33612345682'),
  ('66666666-6666-6666-6666-666666666666', 'Luxury Cars Rental', 'vendor', '+33612345683');

-- Insert vendor profiles
INSERT INTO vendor_profiles (id, company_name, category, description, service_area, base_price, status, rating_avg, rating_count) VALUES
  (
    '22222222-2222-2222-2222-222222222222',
    'Château de Versailles Events',
    'venue',
    'Salles de réception prestigieuses dans un cadre historique exceptionnel. Capacité de 50 à 500 personnes.',
    'Île-de-France',
    2500.00,
    'approved',
    4.8,
    15
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Delicious Catering',
    'catering',
    'Service traiteur haut de gamme spécialisé dans la cuisine française et internationale. Menu personnalisé.',
    'Paris et banlieue',
    45.00,
    'approved',
    4.6,
    28
  ),
  (
    '44444444-4444-4444-4444-444444444444',
    'PhotoMagic Studio',
    'photography',
    'Photographe professionnel pour tous vos événements. Spécialisé en photo de mariage et événementiel.',
    'Île-de-France',
    800.00,
    'approved',
    4.9,
    42
  ),
  (
    '55555555-5555-5555-5555-555555555555',
    'DecorArt',
    'decoration',
    'Décoration florale et événementielle sur mesure. Créations uniques pour vos événements d''exception.',
    'Paris',
    300.00,
    'pending',
    0,
    0
  ),
  (
    '66666666-6666-6666-6666-666666666666',
    'Luxury Cars Rental',
    'car_rental',
    'Location de véhicules de luxe pour vos événements. Berlines, SUV et voitures de collection disponibles.',
    'Île-de-France',
    150.00,
    'approved',
    4.3,
    8
  );

-- Insert sample services
INSERT INTO services (vendor_id, title, description, price_from, duration_hint) VALUES
  ('22222222-2222-2222-2222-222222222222', 'Grande Salle de Réception', 'Salle pouvant accueillir jusqu''à 200 personnes avec vue sur les jardins', 3000.00, '1 journée'),
  ('22222222-2222-2222-2222-222222222222', 'Salon Intimiste', 'Salon cosy pour 50 personnes maximum', 1500.00, '1 journée'),
  ('33333333-3333-3333-3333-333333333333', 'Menu Gastronomique', 'Menu 5 services avec accord mets et vins', 85.00, 'Par personne'),
  ('33333333-3333-3333-3333-333333333333', 'Buffet Cocktail', 'Assortiment de canapés et mignardises', 35.00, 'Par personne'),
  ('44444444-4444-4444-4444-444444444444', 'Pack Mariage Complet', 'Couverture photo complète de votre mariage', 1200.00, '8 heures'),
  ('44444444-4444-4444-4444-444444444444', 'Séance Photo Portrait', 'Séance photo individuelle ou en groupe', 300.00, '2 heures'),
  ('66666666-6666-6666-6666-666666666666', 'Berline de Luxe', 'Mercedes Classe S avec chauffeur', 200.00, 'Par jour'),
  ('66666666-6666-6666-6666-666666666666', 'SUV Premium', 'BMW X7 avec chauffeur privé', 250.00, 'Par jour');

-- Insert sample event
INSERT INTO events (id, organizer_id, title, description, event_date, location_text, budget, status) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Mariage de Marie et Pierre',
    'Célébration de notre union dans un cadre prestigieux avec nos proches.',
    '2024-06-15 15:00:00+02',
    'Château de Versailles Events, Versailles',
    15000.00,
    'published'
  );

-- Insert sample guests
INSERT INTO event_guests (event_id, full_name, email, phone, rsvp_status) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Pierre Martin', 'pierre.martin@email.com', '+33612345690', 'yes'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Sophie Dubois', 'sophie.dubois@email.com', '+33612345691', 'yes'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Jean Moreau', 'jean.moreau@email.com', '+33612345692', 'maybe'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Claire Leroy', 'claire.leroy@email.com', '+33612345693', 'yes'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'Nicolas Bernard', 'nicolas.bernard@email.com', '+33612345694', 'pending');

-- Insert sample bookings
INSERT INTO bookings (id, event_id, customer_id, vendor_id, service_id, status, scheduled_at, amount, payment_status) VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    (SELECT id FROM services WHERE vendor_id = '22222222-2222-2222-2222-222222222222' LIMIT 1),
    'completed',
    '2024-06-15 15:00:00+02',
    3000.00,
    'paid'
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    (SELECT id FROM services WHERE vendor_id = '33333333-3333-3333-3333-333333333333' LIMIT 1),
    'accepted',
    '2024-06-15 19:00:00+02',
    4250.00,
    'unpaid'
  );

-- Insert sample reviews
INSERT INTO reviews (booking_id, customer_id, vendor_id, rating, comment) VALUES
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    '22222222-2222-2222-2222-222222222222',
    5,
    'Lieu absolument magnifique ! Le personnel était aux petits soins et l''organisation parfaite. Je recommande vivement !'
  );

-- Insert sample thread and messages
INSERT INTO threads (id, kind, customer_id, vendor_id, event_id) VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'event_vendor',
    '11111111-1111-1111-1111-111111111111',
    '33333333-3333-3333-3333-333333333333',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'
  );

INSERT INTO messages (thread_id, sender_id, content, type) VALUES
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111',
    'Bonjour, je souhaiterais discuter du menu pour mon mariage. Avez-vous des options végétariennes ?',
    'text'
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '33333333-3333-3333-3333-333333333333',
    'Bonjour Marie ! Bien sûr, nous proposons plusieurs options végétariennes délicieuses. Je vous envoie notre carte spéciale.',
    'text'
  );

-- Create storage buckets (to be run after initial setup)
-- Note: These need to be created via Supabase dashboard or CLI
-- INSERT INTO storage.buckets (id, name, public) VALUES ('public-media', 'public-media', true);
-- INSERT INTO storage.buckets (id, name, public) VALUES ('invites', 'invites', true);