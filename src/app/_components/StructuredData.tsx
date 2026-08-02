import React from 'react';

export default function StructuredData() {
    const jsonLdGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://crizbe.com/#organization',
                name: 'Crizbe',
                url: 'https://crizbe.com',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://crizbe.com/favicon.svg',
                    width: 512,
                    height: 512,
                },
                description:
                    'Crizbe produces premium Belgian chocolate crunch sticks infused with real hazelnut, pistachio, and almond.',
                sameAs: ['https://www.instagram.com/crizbe', 'https://www.facebook.com/crizbe'],
                contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    email: 'support@crizbe.com',
                    availableLanguage: ['English'],
                },
            },
            {
                '@type': 'WebSite',
                '@id': 'https://crizbe.com/#website',
                url: 'https://crizbe.com',
                name: 'Crizbe Premium Chocolate',
                description:
                    'Luxury Belgian chocolate crunch sticks with hazelnut, pistachio & almond.',
                publisher: {
                    '@id': 'https://crizbe.com/#organization',
                },
                potentialAction: {
                    '@type': 'SearchAction',
                    target: 'https://crizbe.com/products?q={search_term_string}',
                    'query-input': 'required name=search_term_string',
                },
            },
            {
                '@type': 'Product',
                '@id': 'https://crizbe.com/#product-crunch-sticks',
                name: 'Crizbe Premium Belgian Chocolate Crunch Sticks',
                image: [
                    'https://crizbe.com/images/user/almond-bottle.png',
                    'https://crizbe.com/images/user/hazelnut-bottle.png',
                    'https://crizbe.com/images/user/pista-bottle.png',
                ],
                description:
                    'Slender, perfectly layered gourmet crunch sticks crafted with premium Belgian chocolate and real hazelnut, pistachio, and almond roasted nut fillings.',
                brand: {
                    '@type': 'Brand',
                    name: 'Crizbe',
                },
                category: 'Confectionery & Gourmet Chocolate',
                aggregateRating: {
                    '@type': 'AggregateRating',
                    ratingValue: '4.9',
                    reviewCount: '128',
                    bestRating: '5',
                    worstRating: '1',
                },
                offers: {
                    '@type': 'Offer',
                    url: 'https://crizbe.com/products',
                    priceCurrency: 'USD',
                    availability: 'https://schema.org/InStock',
                    seller: {
                        '@id': 'https://crizbe.com/#organization',
                    },
                },
            },
            {
                '@type': 'FAQPage',
                '@id': 'https://crizbe.com/#faq',
                mainEntity: [
                    {
                        '@type': 'Question',
                        name: 'What makes Crizbe chocolate crunch sticks unique?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Crizbe crunch sticks combine ultra-slender crispy wafer layers with rich Belgian chocolate and premium roasted nuts (hazelnut, pistachio, almond) for an unparalleled crunch and flavor balance.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'What flavors are available in Crizbe crunch sticks?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Crizbe offers three signature flavors: Roasted Hazelnut Belgian Chocolate, Gourmet Pistachio Cream Crunch, and Caramelized Almond Crunch, as well as a Mixed Variety Pack.',
                        },
                    },
                    {
                        '@type': 'Question',
                        name: 'Are Crizbe chocolates suitable for gifting?',
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: 'Yes, Crizbe packaging is designed with a modern, elegant aesthetic, making it an ideal gift for dessert lovers, corporate gifting, and special occasions.',
                        },
                    },
                ],
            },
        ],
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
    );
}
