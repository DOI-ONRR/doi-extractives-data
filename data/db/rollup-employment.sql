UPDATE bls_employment SET
  region_id = (
    SELECT abbr
    FROM states
    WHERE states.name = bls_employment.state
    LIMIT 1
  );
