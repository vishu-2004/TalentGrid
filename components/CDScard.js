import React from 'react';

export const CDScard = () => {
    const cardData = [
        {
            title: "AI Breakthroughs in 2024",
            description: "Explore the latest AI advancements that are shaping the future of technology.",
        },
        {
            title: "Top Cybersecurity Trends",
            description: "A look at the biggest cybersecurity threats and strategies to stay protected in 2024.",
        },
        {
            title: "Space Exploration Milestones",
            description: "Key achievements in space exploration and what’s next for interplanetary travel.",
        },
        {
            title: "Blockchain Innovations",
            description: "Discover how blockchain is transforming industries beyond cryptocurrency.",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cardData.map((card, index) => (
                <a 
                    key={index} 
                    href="#" 
                    className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                >
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {card.title}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                        {card.description}
                    </p>
                </a>
            ))}
        </div>
    );
};