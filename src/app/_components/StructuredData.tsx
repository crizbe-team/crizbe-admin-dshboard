import React from 'react';

export default function StructuredData() {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'Crizbe Premium Crunch Sticks',
        image: 'https://crizbe.com/images/user/almond-bottle.png',
        description:
            'A slender, perfectly layered crunch stick crafted with real hazelnut, pistachio, and almond—where texture meets indulgence in every bite.',
        brand: {
            '@type': 'Brand',
            name: 'Crizbe',
        },
        offers: {
            '@type': 'Offer',
            url: 'https://crizbe.com',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    );
}
