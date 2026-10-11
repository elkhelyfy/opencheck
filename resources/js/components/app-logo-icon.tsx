import type { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <svg {...props} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M34.1 14.87A15 15 0 1 1 25.13 5.9"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />
            <path
                d="M13 20.5l5.5 5.5L33 9.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
