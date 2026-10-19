import React from 'react';

export default function StructuredData() {
    const jsonLdGraph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Organization',
                '@id': 'https://www.crizbe.com/#organization',
                name: 'Crizbe Foods Private Limited',
                alternateName: 'Crizbe',
                url: 'https://www.crizbe.com/',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://www.crizbe.com/images/user/crizbe-logo.svg',
                },
                email: 'mailto:info@crizbe.com',
                telephone: '+91 90724 20226',
                address: {
                    '@type': 'PostalAddress',
                    streetAddress: 'Charuvila Building 1st Floor, Door: 773, Venchempu PO',
                    addressLocality: 'Punalur',
                    addressRegion: 'Kerala',
                    postalCode: '691333',
                    addressCountry: 'IN',
                },
            },
            {
                '@type': 'WebSite',
                '@id': 'https://www.crizbe.com/#website',
                url: 'https://www.crizbe.com/',
                name: 'Crizbe',
                publisher: {
                    '@id': 'https://www.crizbe.com/#organization',
                },
                inLanguage: 'en-IN',
            },
            {
                '@type': 'WebPage',
                '@id': 'https://www.crizbe.com/#webpage',
                url: 'https://www.crizbe.com/',
                name: 'Premium Chocolate & Crunch Sticks Online India | Crizbe',
                isPartOf: {
                    '@id': 'https://www.crizbe.com/#website',
                },
                about: {
                    '@id': 'https://www.crizbe.com/#organization',
                },
                inLanguage: 'en-IN',
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
