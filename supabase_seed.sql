-- Seed data for Supabase database matching current frontend mock data

INSERT INTO public.patients (id, name, age, gender, mobile, village, address, blood_group, history, created_at) VALUES
('AV-P1001', 'Ramesh Gowda', 62, 'Male', '9845012233', 'Hosahalli', 'Door 14, Main Road, Hosahalli, Tumakuru Taluk', 'B+', 'Type 2 diabetes since 2013, hypertension on Amlodipine 5mg, past hospitalisation for chest pain (2021).', NOW() - INTERVAL '220 days'),
('AV-P1002', 'Lakshmi Bai', 34, 'Female', '9731122045', 'Kadalur', 'Near Anganwadi, Kadalur, Gubbi Taluk', 'O+', 'Second pregnancy, mild anaemia (Hb 9.4), no chronic illness.', NOW() - INTERVAL '140 days'),
('AV-P1003', 'Shivanna M', 47, 'Male', '9900456781', 'Beeranahalli', 'Farm House Lane, Beeranahalli, Koratagere', 'A+', 'Smoker for 20 years, recurring cough, treated for pulmonary TB in 2018.', NOW() - INTERVAL '96 days'),
('AV-P1004', 'Kavya Shetty', 8, 'Female', '9611209876', 'Nandipura', 'Ward 3, Nandipura, Tumakuru', 'AB+', 'Childhood asthma, uses salbutamol inhaler during episodes.', NOW() - INTERVAL '61 days')
ON CONFLICT (id) DO NOTHING;
