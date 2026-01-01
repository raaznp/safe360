import { useState, useEffect } from 'react';

const useTeam = () => {
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeam = async () => {
            try {
                const res = await fetch('/api/team');
                if (!res.ok) throw new Error('Failed to fetch team');
                const json = await res.json();
                setTeam(json);
            } catch (err) {
                console.error('Error fetching team:', err);
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, []);

    return { team, loading, error };
};

export default useTeam;
