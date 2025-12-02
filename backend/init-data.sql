-- Script pour insérer des données d'exemple
-- Exécutez ceci une fois après la création de la base de données

-- Insérer des services
INSERT INTO services (name, description, duration, price) VALUES
  ('Coupe Homme', 'Coupe classique pour hommes', 30, 15.00),
  ('Coupe Femme', 'Coupe moderne pour femmes', 45, 25.00),
  ('Coloration', 'Coloration complète', 60, 40.00),
  ('Balayage', 'Balayage californien', 75, 50.00),
  ('Brushing', 'Brushing et mise en forme', 30, 12.00);

-- Insérer les horaires d'ouverture
INSERT INTO opening_hours (day_of_week, opening_time, closing_time, is_closed) VALUES
  (0, '09:00', '18:00', FALSE),  -- Lundi
  (1, '09:00', '18:00', FALSE),  -- Mardi
  (2, '09:00', '18:00', FALSE),  -- Mercredi
  (3, '09:00', '18:00', FALSE),  -- Jeudi
  (4, '09:00', '18:00', FALSE),  -- Vendredi
  (5, '10:00', '16:00', FALSE),  -- Samedi
  (6, '10:00', '14:00', FALSE);  -- Dimanche

-- Insérer les informations du salon
INSERT INTO salon_info (name, phone, email, address, description) VALUES
  (
    'AYS Coiffure',
    '+33612345678',
    'contact@ayscoiffure.fr',
    '123 Rue de la Beauté, 75000 Paris',
    'Bienvenue dans notre salon de coiffure moderne situé au cœur de Paris. Nous offrons des services de qualité avec une équipe professionnelle et accueillante.'
  );
