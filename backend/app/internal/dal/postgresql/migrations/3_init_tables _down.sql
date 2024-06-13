-- Active: 1717324317447@@127.0.0.1@5435@hospital
--------------------------- Migrate DOWN ---------------------------

DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.users_verification_data CASCADE;
DROP TABLE IF EXISTS public.doctor CASCADE;
DROP TABLE IF EXISTS public.appointment CASCADE;
DROP TABLE IF EXISTS public.news CASCADE;
DROP TABLE IF EXISTS public.review CASCADE;
DROP TABLE IF EXISTS public.call_request CASCADE;