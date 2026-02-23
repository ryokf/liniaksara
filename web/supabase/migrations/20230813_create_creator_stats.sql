-- Function to get top creators with their details
CREATE OR REPLACE FUNCTION public.get_top_creators(limit_count INTEGER DEFAULT 10)
RETURNS TABLE (
    author_id UUID,
    name VARCHAR(50),
    username VARCHAR(50),
    avatar_url VARCHAR(255),
    total_sales BIGINT,
    works_count BIGINT
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    WITH creator_stats AS (
        SELECT 
            w.author_id,
            COUNT(DISTINCT wt.id)::BIGINT as sales_count,
            COUNT(DISTINCT w.id)::BIGINT as works_count
        FROM works w
        LEFT JOIN work_transactions wt ON w.id = wt.work_id
        GROUP BY w.author_id
    )
    SELECT 
        cs.author_id,
        p.name::VARCHAR(50),
        p.username::VARCHAR(50),
        p.photo_url::VARCHAR(255) as avatar_url,
        COALESCE(cs.sales_count, 0) as total_sales,
        COALESCE(cs.works_count, 0) as works_count
    FROM creator_stats cs
    JOIN profiles p ON cs.author_id = p.id
    ORDER BY cs.sales_count DESC
    LIMIT limit_count;
END;
$$;
