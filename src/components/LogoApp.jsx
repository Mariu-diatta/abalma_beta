import React from "react";

const Logo = () => {

    return (

            <svg width="200" height="70" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">

                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#4F46E5" />
                        <stop offset="100%" stopColor="#06B6D4" />
                    </linearGradient>
                </defs>

                <rect x="10" y="10" width="90" height="90" rx="20" fill="url(#grad)" />

                <path d="M60 30 L85 90 H75 L70 75 H50 L45 90 H35 Z M55 65 H65 L60 50 Z" fill="white" />

                <text x="80" y="80" fontFamily="Arial, Helvetica, sans-serif" fontSize="60" fill="gray" fontWeight="600"  letterSpacing="2">
                    balma
                </text>

            </svg>
    );
};

export default Logo;
