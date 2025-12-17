    -- Enable required PostgreSQL extensions for fuzzy search and geospatial queries
    CREATE EXTENSION IF NOT EXISTS "pg_trgm";
    CREATE EXTENSION IF NOT EXISTS "postgis";

    -- Fuzzy search indexes for medication names (autocomplete + typo tolerance)
    CREATE INDEX IF NOT EXISTS "medications_commercial_name_trgm_idx"
    ON "medications"
    USING GIN ("commercial_name" gin_trgm_ops);

    CREATE INDEX IF NOT EXISTS "medications_dci_name_trgm_idx"
    ON "medications"
    USING GIN ("dci_name" gin_trgm_ops);

    -- Geospatial index for addresses to speed up distance-based lookups
    -- Note: latitude/longitude stored as numeric; cast to double precision for PostGIS
    CREATE INDEX IF NOT EXISTS "addresses_location_gix"
    ON "addresses"
    USING GIST (
        ST_SetSRID(
        ST_MakePoint("longitude"::double precision, "latitude"::double precision),
        4326
        )
    );

    -- Optional: index for searches table if reused for heatmaps or history distance queries
    CREATE INDEX IF NOT EXISTS "searches_location_gix"
    ON "searches"
    USING GIST (
        ST_SetSRID(
        ST_MakePoint("longitude"::double precision, "latitude"::double precision),
        4326
        )
    );



