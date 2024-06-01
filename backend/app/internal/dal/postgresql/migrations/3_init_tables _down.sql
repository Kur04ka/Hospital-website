--------------------------- Migrate DOWN ---------------------------

DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS users_verification_data CASCADE;
DROP TABLE IF EXISTS doctor CASCADE;
DROP TABLE IF EXISTS appointment CASCADE;
DROP TABLE IF EXISTS news CASCADE;
DROP TABLE IF EXISTS review CASCADE;