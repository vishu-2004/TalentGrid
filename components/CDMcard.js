import React from 'react';

export const CDMcard = ({ plan }) => {
    return (
        <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <h5 className="mb-4 text-xl font-medium text-gray-500 dark:text-gray-400">{plan.name}</h5>
            <div className="flex items-baseline text-gray-900 dark:text-white">
                <span className="text-3xl font-semibold">$</span>
                <span className="text-5xl font-extrabold tracking-tight">{plan.price}</span>
                <span className="ms-1 text-xl font-normal text-gray-500 dark:text-gray-400">/month</span>
            </div>
            <ul role="list" className="space-y-5 my-7">
                {plan.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center">
                        <svg className="flex-shrink-0 w-4 h-4 text-blue-700 dark:text-blue-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-500 dark:text-gray-400 ms-3">{benefit}</span>
                    </li>
                ))}
                {plan.unavailable.map((feature, index) => (
                    <li key={index} className="flex line-through decoration-gray-500">
                        <svg className="flex-shrink-0 w-4 h-4 text-gray-400 dark:text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                        </svg>
                        <span className="text-base font-normal leading-tight text-gray-500 ms-3">{feature}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

// Data for plans
export const plans = [
    {
        name: "Standard Plan",
        price: 49,
        benefits: [
            "2 team members",
            "20GB Cloud storage",
            "Integration help",
        ],
        unavailable: [
            "Sketch Files",
            "API Access",
            "Complete documentation",
            "24×7 phone & email support",
        ],
    },
    {
        name: "Premium Plan",
        price: 99,
        benefits: [
            "10 team members",
            "100GB Cloud storage",
            "Priority integration support",
            "Sketch Files",
            "API Access",
            "Complete documentation",
        ],
        unavailable: [
            "24×7 phone & email support",
        ],
    }
];
