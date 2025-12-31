import { useState, useEffect } from 'react';

const usePageContent = (slug) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const res = await fetch(`http://localhost:5001/api/pages/${slug}`);
                if (!res.ok) {
                    throw new Error('Failed to fetch page content');
                }
                const json = await res.json();
                setData(json);
            } catch (err) {
                console.error(`Error fetching page ${slug}:`, err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [slug]);

    return { page: data, loading, error };
};

export default usePageContent;
