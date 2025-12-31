import { useEffect, useRef } from 'react';

const TurnstileWidget = ({ onVerify }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        // Function to render the widget
        const renderWidget = () => {
            if (window.turnstile && containerRef.current && !containerRef.current.hasChildNodes()) {
                window.turnstile.render(containerRef.current, {
                    sitekey: '1x00000000000000000000AA', // Cloudflare Testing Site Key (Always Passes)
                    callback: (token) => {
                        onVerify(token);
                    },
                });
            }
        };

        // Load script if not present
        if (!document.getElementById('turnstile-script')) {
            const script = document.createElement('script');
            script.id = 'turnstile-script';
            script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
            script.async = true;
            script.defer = true;
            script.onload = renderWidget;
            document.body.appendChild(script);
        } else {
            // If script is already loaded, render immediately
            if (window.turnstile) {
                renderWidget();
            } else {
                // Wait for it to load if it's currently loading
                window.onload = renderWidget; // Fallback? 
                // Better approach: check periodically or listen to load event if possible, 
                // but for simplicity we rely on the script loading fast or being cached.
                // Re-triggering script load isn't ideal.
                // A simple timeout check:
                const checkInterval = setInterval(() => {
                    if (window.turnstile) {
                        clearInterval(checkInterval);
                        renderWidget();
                    }
                }, 100);
            }
        }

        return () => {
            // Cleanup if needed
        };
    }, [onVerify]);

    return (
        <div ref={containerRef} className="my-4 flex justify-center min-h-[65px]" />
    );
};

export default TurnstileWidget;
