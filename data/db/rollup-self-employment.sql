UPDATE self_employment SET
  region_id = (
    SELECT abbr
    FROM states
    WHERE states.name = self_employment.region
    LIMIT 1
  );
