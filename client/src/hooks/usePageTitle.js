import { useEffect } from 'react';

const usePageTitle = (title) => {
    useEffect(() => {
        document.title = title ? `${title} | Safe360` : 'Safe360';
    }, [title]);
};

export default usePageTitle;
