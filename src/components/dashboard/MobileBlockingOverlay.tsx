'use client'

import { useMediaQuery } from "@/components/hooks/useMediaQuery";

export default function MobileBlockingOverlay() {
    const isMobile = useMediaQuery("(max-width: 767px)");

    if (!isMobile) return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            textAlign: 'center'
        }}>
            <p style={{
                color: 'black',
                fontSize: '18px',
                fontWeight: '500',
                margin: 0
            }}>
                Dashboard is not available on mobile yet
            </p>
        </div>
    );
}
