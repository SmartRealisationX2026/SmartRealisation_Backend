-- Script de validation de la structure de base de données MediLink
-- Utilisation: psql -d medilink_db -f prisma/scripts/validate.sql

-- Vérification des tables
\echo '=== TABLES CRÉÉES ==='
SELECT schemaname, tablename
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('users', 'pharmacies', 'medications', 'stocks', 'searches', 'alerts', 'audit_logs')
ORDER BY tablename;

-- Vérification des contraintes FK
\echo '\n=== CONTRAINTES FOREIGN KEY ==='
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_name IN ('users', 'pharmacies', 'medications', 'stocks', 'searches', 'alerts', 'audit_logs')
ORDER BY tc.table_name, kcu.column_name;

-- Vérification des index
\echo '\n=== INDEX CRÉÉS ==='
SELECT
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('users', 'pharmacies', 'medications', 'stocks', 'searches', 'alerts', 'audit_logs')
ORDER BY tablename, indexname;

-- Vérification des contraintes UNIQUE
\echo '\n=== CONTRAINTES UNIQUE ==='
SELECT
    tc.table_name,
    kcu.column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'UNIQUE'
  AND tc.table_name IN ('users', 'pharmacies', 'medications', 'stocks', 'searches', 'alerts', 'audit_logs')
ORDER BY tc.table_name, kcu.column_name;

-- Vérification des enums
\echo '\n=== ENUMS CRÉÉS ==='
SELECT
    n.nspname AS schema,
    t.typname AS enum_name,
    string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder) AS enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
JOIN pg_namespace n ON t.typnamespace = n.oid
WHERE t.typname IN ('userrole', 'alertstatus', 'language')
GROUP BY n.nspname, t.typname
ORDER BY t.typname;

-- Comptage des enregistrements par table
\echo '\n=== NOMBRE D\'ENREGISTREMENTS PAR TABLE ==='
SELECT
    'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'pharmacies', COUNT(*) FROM pharmacies
UNION ALL
SELECT 'medications', COUNT(*) FROM medications
UNION ALL
SELECT 'stocks', COUNT(*) FROM stocks
UNION ALL
SELECT 'searches', COUNT(*) FROM searches
UNION ALL
SELECT 'alerts', COUNT(*) FROM alerts
UNION ALL
SELECT 'audit_logs', COUNT(*) FROM audit_logs
ORDER BY table_name;

\echo '\n=== VALIDATION TERMINÉE ==='
