SELECT mt.type_name, m.meta_name
FROM metadata_type mt
JOIN metadata m ON mt.id = m.type_id
WHERE EXISTS (
    SELECT 1
    FROM metadata
    WHERE type_id = mt.id
)
ORDER BY mt.type_name, m.meta_name ASC;