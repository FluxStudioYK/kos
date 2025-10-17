/*
  # Create bookings table

  1. New Tables
    - `bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid) - References auth.users
      - `room_type` (text) - Type of room (type1, type2)
      - `room_name` (text) - Name of room
      - `room_price` (text) - Display price per month
      - `price_value` (integer) - Numeric price per month
      - `duration_months` (integer) - Duration in months
      - `total_price` (integer) - Total price
      - `price_formatted` (text) - Formatted total price
      - `status` (text, default 'pending') - Booking status: pending, confirmed, cancelled
      - `created_at` (timestamptz) - When booking was created
      - `updated_at` (timestamptz) - When booking was last updated

  2. Security
    - Enable RLS on `bookings` table
    - Add policy for users to read their own bookings
    - Add policy for users to insert their own bookings
    - Add policy for users to update their own bookings
*/

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  room_type text NOT NULL,
  room_name text NOT NULL,
  room_price text NOT NULL,
  price_value integer NOT NULL,
  duration_months integer NOT NULL,
  total_price integer NOT NULL,
  price_formatted text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();