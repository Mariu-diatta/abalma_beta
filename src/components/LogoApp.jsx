import React from "react";

const Logo = () => {

    return (


            <svg width="200" height="160" viewBox="0 0 300 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#4F46E5" />
                        <stop offset="100%" stop-color="#06B6D4" />
                    </linearGradient>
                </defs>

                <rect x="10" y="10" width="100" height="100" rx="20" fill="url(#grad)" />

                <path d="M60 30 L85 90 H75 L70 75 H50 L45 90 H35 Z M55 65 H65 L60 50 Z" fill="white" />

                <text x="90" y="80" font-family="Arial, Helvetica, sans-serif" font-size="60" fill="gray" font-weight="600"  letter-spacing="2">
                    balma
                </text>

            </svg>

            

     
    );
};

export default Logo;
