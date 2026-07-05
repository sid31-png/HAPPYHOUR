-- Seed : 18 lieux fictifs à Doha (West Bay, The Pearl, Msheireb, Katara)
-- + happy hours variés + 6 événements à venir.

insert into venues (id, name, slug, category, description, address, lat, lng, photos, price_level, rating, is_partner) values
  ('11111111-0000-0000-0000-000000000001', 'Sky View Rooftop', 'sky-view-rooftop', 'rooftop', 'Rooftop avec vue panoramique sur la skyline de West Bay, cocktails signature et DJ le soir.', 'Tornado Tower, West Bay, Doha', 25.3215, 51.5285, '{}', 3, 4.6, true),
  ('11111111-0000-0000-0000-000000000002', 'La Central Café', 'la-central-cafe', 'cafe', 'Café de spécialité, torréfaction maison et pâtisseries françaises.', 'West Bay, Doha', 25.3230, 51.5260, '{}', 2, 4.4, true),
  ('11111111-0000-0000-0000-000000000003', 'The Brew House', 'the-brew-house', 'cafe', 'Coffee shop industriel-chic prisé des expats pour le brunch.', 'West Bay, Doha', 25.3195, 51.5310, '{}', 2, 4.3, false),
  ('11111111-0000-0000-0000-000000000004', 'Vantage Sky Bar', 'vantage-sky-bar', 'rooftop', 'Bar perché au 45e étage, ambiance lounge et golden hour imprenable.', 'West Bay, Doha', 25.3250, 51.5240, '{}', 4, 4.7, true),
  ('11111111-0000-0000-0000-000000000005', 'Amber Lounge', 'amber-lounge', 'bar', 'Bar à cocktails feutré, jazz live le jeudi.', 'West Bay, Doha', 25.3180, 51.5275, '{}', 3, 4.2, false),
  ('22222222-0000-0000-0000-000000000001', 'Portofino Café', 'portofino-cafe', 'cafe', 'Café italien en bord de marina, terrasse ensoleillée.', 'Qanat Quartier, The Pearl, Doha', 25.3700, 51.5510, '{}', 2, 4.5, true),
  ('22222222-0000-0000-0000-000000000002', 'Marina Social', 'marina-social', 'bar', 'Bar à vin et tapas face aux yachts de la marina.', 'Porto Arabia, The Pearl, Doha', 25.3680, 51.5530, '{}', 3, 4.5, true),
  ('22222222-0000-0000-0000-000000000003', 'The Pearl Rooftop', 'the-pearl-rooftop', 'rooftop', 'Rooftop élégant, piscine à débordement et DJ resident.', 'Viva Bahriya, The Pearl, Doha', 25.3720, 51.5495, '{}', 4, 4.8, true),
  ('22222222-0000-0000-0000-000000000004', 'Ciel Bleu Bistro', 'ciel-bleu-bistro', 'restaurant', 'Bistrot méditerranéen, happy hour à l''apéro.', 'Porto Arabia, The Pearl, Doha', 25.3665, 51.5545, '{}', 3, 4.4, false),
  ('22222222-0000-0000-0000-000000000005', 'Aqua Bar', 'aqua-bar', 'bar', 'Bar de plage décontracté, cocktails tropicaux.', 'Qanat Quartier, The Pearl, Doha', 25.3710, 51.5520, '{}', 2, 4.1, false),
  ('33333333-0000-0000-0000-000000000001', 'Heritage Café', 'heritage-cafe', 'cafe', 'Café dans une maison traditionnelle rénovée du centre historique.', 'Msheireb Downtown, Doha', 25.2865, 51.5310, '{}', 2, 4.6, true),
  ('33333333-0000-0000-0000-000000000002', 'Msheireb Social Bar', 'msheireb-social-bar', 'bar', 'Bar urbain au cœur du quartier durable de Msheireb.', 'Msheireb Downtown, Doha', 25.2880, 51.5325, '{}', 3, 4.3, false),
  ('33333333-0000-0000-0000-000000000003', 'Downtown Rooftop', 'downtown-rooftop', 'rooftop', 'Vue sur les tours de Msheireb, ambiance lounge.', 'Msheireb Downtown, Doha', 25.2850, 51.5300, '{}', 3, 4.4, true),
  ('33333333-0000-0000-0000-000000000004', 'Al Fresco Kitchen', 'al-fresco-kitchen', 'restaurant', 'Cuisine méditerranéenne en terrasse ombragée.', 'Msheireb Downtown, Doha', 25.2895, 51.5290, '{}', 2, 4.2, false),
  ('44444444-0000-0000-0000-000000000001', 'Katara Beach Bar', 'katara-beach-bar', 'bar', 'Bar de plage face au Golfe, coucher de soleil garanti.', 'Katara Cultural Village, Doha', 25.3630, 51.5240, '{}', 3, 4.5, true),
  ('44444444-0000-0000-0000-000000000002', 'Cultural Café', 'cultural-cafe', 'cafe', 'Café artisanal près de l''amphithéâtre de Katara.', 'Katara Cultural Village, Doha', 25.3615, 51.5225, '{}', 2, 4.3, false),
  ('44444444-0000-0000-0000-000000000003', 'Amphitheatre Lounge', 'amphitheatre-lounge', 'bar', 'Lounge en plein air, concerts et happy hour au coucher du soleil.', 'Katara Cultural Village, Doha', 25.3605, 51.5250, '{}', 3, 4.4, true),
  ('44444444-0000-0000-0000-000000000004', 'Dune Rooftop', 'dune-rooftop', 'rooftop', 'Rooftop design inspiré des dunes, cocktails signature.', 'Katara Cultural Village, Doha', 25.3645, 51.5210, '{}', 4, 4.6, true);

insert into happy_hours (venue_id, title, description, days_of_week, start_time, end_time, is_active) values
  ('11111111-0000-0000-0000-000000000001', '-40% sur les cocktails signature', 'Sur toute la carte de cocktails maison.', '{1,2,3,4,5}', '17:00', '20:00', true),
  ('11111111-0000-0000-0000-000000000002', '2 cafés achetés = 1 offert', 'Sur les boissons chaudes uniquement.', '{1,2,3,4,5,6,7}', '15:00', '18:00', true),
  ('11111111-0000-0000-0000-000000000003', '-30% pâtisseries', 'Toute la vitrine à -30%.', '{1,2,3,4,5}', '16:00', '19:00', true),
  ('11111111-0000-0000-0000-000000000004', '-50% cocktails golden hour', 'La spécialité maison à moitié prix.', '{4,5,6}', '17:30', '19:30', true),
  ('11111111-0000-0000-0000-000000000005', '-35% sur la carte des vins', 'Sélection de vins du monde.', '{2,3,4}', '18:00', '21:00', true),
  ('22222222-0000-0000-0000-000000000001', 'Café + viennoiserie à 20 QAR', 'Formule petit-déjeuner tardif.', '{1,2,3,4,5,6,7}', '14:00', '17:00', true),
  ('22222222-0000-0000-0000-000000000002', '-40% tapas & vin au verre', 'Planches à partager à prix réduit.', '{1,2,3,4,5}', '17:00', '20:00', true),
  ('22222222-0000-0000-0000-000000000003', '-50% cocktails piscine', 'Accès piscine inclus pour les clients du rooftop.', '{5,6}', '16:00', '19:00', true),
  ('22222222-0000-0000-0000-000000000004', '-25% menu apéro', 'Planches et boissons à l''apéritif.', '{3,4,5}', '18:00', '20:30', true),
  ('22222222-0000-0000-0000-000000000005', '-30% cocktails tropicaux', 'Mojitos et piña colada à prix doux.', '{1,2,3,4,5,6,7}', '16:00', '19:00', true),
  ('33333333-0000-0000-0000-000000000001', '-20% sur les brunchs', 'Formule brunch complète.', '{6,7}', '10:00', '13:00', true),
  ('33333333-0000-0000-0000-000000000002', '-40% bières pression', 'Sélection de bières locales et internationales.', '{1,2,3,4,5}', '17:00', '20:00', true),
  ('33333333-0000-0000-0000-000000000003', '-45% cocktails signature', 'Vue sur les tours illuminées.', '{4,5,6}', '18:00', '21:00', true),
  ('33333333-0000-0000-0000-000000000004', '-30% plats méditerranéens', 'Menu du soir à prix réduit.', '{2,3,4}', '17:00', '19:00', true),
  ('44444444-0000-0000-0000-000000000001', '-40% cocktails coucher de soleil', 'Le meilleur spot pour le sunset à Doha.', '{1,2,3,4,5,6,7}', '17:00', '19:30', true),
  ('44444444-0000-0000-0000-000000000002', '-25% boissons froides', 'Jus frais et cafés glacés.', '{1,2,3,4,5}', '15:00', '18:00', true),
  ('44444444-0000-0000-0000-000000000003', '-35% sur la carte', 'Happy hour avec vue sur l''amphithéâtre.', '{4,5,6}', '18:30', '21:00', true),
  ('44444444-0000-0000-0000-000000000004', '-50% premier cocktail', 'Un cocktail signature offert à -50%.', '{3,4,5}', '17:00', '19:00', true);

insert into offers (venue_id, happy_hour_id, title, description, discount_label, is_exclusive, estimated_saving, status) values
  ('11111111-0000-0000-0000-000000000001', (select id from happy_hours where venue_id = '11111111-0000-0000-0000-000000000001'), '-40% sur les cocktails signature', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-40% cocktails', true, 60, 'active'),
  ('11111111-0000-0000-0000-000000000002', (select id from happy_hours where venue_id = '11111111-0000-0000-0000-000000000002'), '2 cafés achetés = 1 offert', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '2=1 café', true, 35, 'active'),
  ('11111111-0000-0000-0000-000000000003', (select id from happy_hours where venue_id = '11111111-0000-0000-0000-000000000003'), '-30% pâtisseries', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-30% pâtisseries', true, 30, 'active'),
  ('11111111-0000-0000-0000-000000000004', (select id from happy_hours where venue_id = '11111111-0000-0000-0000-000000000004'), '-50% cocktails golden hour', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-50% cocktails', true, 110, 'active'),
  ('11111111-0000-0000-0000-000000000005', (select id from happy_hours where venue_id = '11111111-0000-0000-0000-000000000005'), '-35% sur la carte des vins', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-35% vins', true, 70, 'active'),
  ('22222222-0000-0000-0000-000000000001', (select id from happy_hours where venue_id = '22222222-0000-0000-0000-000000000001'), 'Café + viennoiserie à 20 QAR', 'Offre exclusive Happy Hour, à débloquer dans l''app.', 'Formule à 20 QAR', true, 32, 'active'),
  ('22222222-0000-0000-0000-000000000002', (select id from happy_hours where venue_id = '22222222-0000-0000-0000-000000000002'), '-40% tapas & vin au verre', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-40% tapas & vin', true, 75, 'active'),
  ('22222222-0000-0000-0000-000000000003', (select id from happy_hours where venue_id = '22222222-0000-0000-0000-000000000003'), '-50% cocktails piscine', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-50% cocktails', true, 120, 'active'),
  ('22222222-0000-0000-0000-000000000004', (select id from happy_hours where venue_id = '22222222-0000-0000-0000-000000000004'), '-25% menu apéro', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-25% menu apéro', true, 55, 'active'),
  ('22222222-0000-0000-0000-000000000005', (select id from happy_hours where venue_id = '22222222-0000-0000-0000-000000000005'), '-30% cocktails tropicaux', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-30% cocktails', true, 40, 'active'),
  ('33333333-0000-0000-0000-000000000001', (select id from happy_hours where venue_id = '33333333-0000-0000-0000-000000000001'), '-20% sur les brunchs', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-20% brunch', true, 38, 'active'),
  ('33333333-0000-0000-0000-000000000002', (select id from happy_hours where venue_id = '33333333-0000-0000-0000-000000000002'), '-40% bières pression', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-40% bières', true, 45, 'active'),
  ('33333333-0000-0000-0000-000000000003', (select id from happy_hours where venue_id = '33333333-0000-0000-0000-000000000003'), '-45% cocktails signature', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-45% cocktails', true, 85, 'active'),
  ('33333333-0000-0000-0000-000000000004', (select id from happy_hours where venue_id = '33333333-0000-0000-0000-000000000004'), '-30% plats méditerranéens', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-30% plats', true, 50, 'active'),
  ('44444444-0000-0000-0000-000000000001', (select id from happy_hours where venue_id = '44444444-0000-0000-0000-000000000001'), '-40% cocktails coucher de soleil', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-40% cocktails', true, 65, 'active'),
  ('44444444-0000-0000-0000-000000000002', (select id from happy_hours where venue_id = '44444444-0000-0000-0000-000000000002'), '-25% boissons froides', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-25% boissons', true, 30, 'active'),
  ('44444444-0000-0000-0000-000000000003', (select id from happy_hours where venue_id = '44444444-0000-0000-0000-000000000003'), '-35% sur la carte', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-35% carte', true, 70, 'active'),
  ('44444444-0000-0000-0000-000000000004', (select id from happy_hours where venue_id = '44444444-0000-0000-0000-000000000004'), '-50% premier cocktail', 'Offre exclusive Happy Hour, à débloquer dans l''app.', '-50% 1er cocktail', true, 95, 'active');

insert into events (venue_id, title, description, category, starts_at, ends_at, price_from, capacity, photos) values
  ('11111111-0000-0000-0000-000000000004', 'Soirée DJ Sunset Sessions', 'Set live face au coucher de soleil sur West Bay.', 'party', now() + interval '2 days' + time '18:00', now() + interval '2 days' + time '23:00', 150, 200, '{}'),
  ('22222222-0000-0000-0000-000000000003', 'Pool Party Pearl', 'Journée piscine avec DJ et bar à cocktails.', 'party', now() + interval '5 days' + time '14:00', now() + interval '5 days' + time '20:00', 250, 300, '{}'),
  ('33333333-0000-0000-0000-000000000003', 'Jazz Night Msheireb', 'Trio de jazz live sur le rooftop.', 'live_music', now() + interval '3 days' + time '19:30', now() + interval '3 days' + time '23:00', 100, 120, '{}'),
  ('44444444-0000-0000-0000-000000000003', 'Concert acoustique à Katara', 'Scène ouverte à l''amphithéâtre culturel.', 'live_music', now() + interval '7 days' + time '19:00', now() + interval '7 days' + time '22:00', 0, 500, '{}'),
  ('22222222-0000-0000-0000-000000000002', 'Dégustation de vins', 'Découverte de vins du monde avec sommelier.', 'experience', now() + interval '4 days' + time '18:00', now() + interval '4 days' + time '21:00', 180, 40, '{}'),
  ('44444444-0000-0000-0000-000000000001', 'Beach Bonfire Night', 'Feu de camp sur la plage, food trucks et DJ.', 'experience', now() + interval '6 days' + time '19:00', now() + interval '6 days' + time '23:30', 120, 150, '{}');
