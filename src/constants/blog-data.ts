export interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: {
        name: string;
        role: string;
        avatar: string;
    };
    publishedAt: string;
    readTime: string;
    coverImage: string;
    tags: string[];
    keywords: string[];
}

export const blogPosts: BlogPost[] = [
    {
        id: '1',
        slug: 'art-of-belgian-chocolate-crunch-sticks',
        title: 'The Art of Belgian Chocolate Crunch Sticks: A Gourmet Guide',
        excerpt:
            'Discover how delicate crispy wafer layers combine with premium Belgian chocolate and real roasted nut pastes to create the ultimate luxury snack.',
        content: `
            <p className="lead">When gourmet confectionery craftsmanship meets precision layering, the result is an irresistible sensory experience. At Crizbe, every crunch stick represents a dedication to texture, aroma, and premium ingredients.</p>
            
            <h2>Why Belgian Chocolate Sets the Gold Standard</h2>
            <p>Belgian chocolate is world-renowned for its fine grind, high cocoa butter content, and rich, silky mouthfeel. When paired with ultra-thin, golden crisp wafers, it creates a subtle contrast between delicate crunch and melting indulgence.</p>
            
            <h2>The Secret Behind the Slender Crunch</h2>
            <p>Unlike heavy chocolate bars, slender crunch sticks offer a balanced proportion of cocoa coating to crispy wafer core. This allows subtle nut notes—whether roasted hazelnut, Mediterranean pistachio, or caramelized almond—to shine through without being overpowered by sweetness.</p>

            <h2>Perfect Pairings for Coffee & Dessert Hours</h2>
            <p>Gourmet chocolate crunch sticks make the perfect companion for espresso, cappuccino, or dark roast drip coffee. The warm bitterness of roasted coffee beans elevates the rich cocoa butter tones in the chocolate, making your daily coffee ritual feel like a visit to an artisanal European cafe.</p>
        `,
        category: 'Gourmet Chocolate',
        author: {
            name: 'Crizbe Culinary Team',
            role: 'Master Chocolatier',
            avatar: '/images/user/og-image.jpeg',
        },
        publishedAt: '2026-07-15',
        readTime: '4 min read',
        coverImage: '/images/user/hazelnut-bottle.png',
        tags: ['Belgian Chocolate', 'Crunch Sticks', 'Gourmet Snacks', 'Hazelnut'],
        keywords: [
            'Belgian chocolate crunch sticks',
            'gourmet chocolate snacks',
            'luxury crunch sticks',
            'hazelnut chocolate sticks',
        ],
    },
    {
        id: '2',
        slug: 'hazelnut-pistachio-almond-gourmet-pairings',
        title: 'Hazelnut, Pistachio & Almond: The Ultimate Nut Triad in Confectionery',
        excerpt:
            'Explore the flavor science behind why hazelnuts, pistachios, and almonds are the world’s most coveted nuts for chocolate pairings.',
        content: `
            <p className="lead">Nuts and chocolate have been inseparable partners in fine confectionery for centuries. However, selecting and roasting the right nut varieties elevates a simple snack into a gourmet masterpiece.</p>
            
            <h2>Roasted Hazelnut: Deep, Earthy & Praline Notes</h2>
            <p>Hazelnuts possess natural oils that bloom when slow-roasted. When ground into a velvety praline cream, hazelnut enhances milk and dark Belgian chocolate with nutty warmth and caramel undertones.</p>
            
            <h2>Mediterranean Pistachio: Delicate, Creamy & Vibrantly Aromatic</h2>
            <p>Pistachio represents modern luxury. Its mild, sweet flavor profile and delicate green color add a refined elegance to wafer crunch sticks, appealing to discerning palates seeking a lighter, sophisticated dessert.</p>

            <h2>Caramelized Almond: Crisp, Bold & Satisfying</h2>
            <p>Almonds bring a classic, structured crunch. Slow-caramelizing California almonds prior to pairing with chocolate unlocks a toasted butteriness that perfectly contrasts delicate wafer textures.</p>
        `,
        category: 'Flavor Science',
        author: {
            name: 'Crizbe Culinary Team',
            role: 'Flavor Specialist',
            avatar: '/images/user/og-image.jpeg',
        },
        publishedAt: '2026-07-20',
        readTime: '5 min read',
        coverImage: '/images/user/pista-bottle.png',
        tags: ['Pistachio', 'Almond', 'Hazelnut', 'Flavor Pairing'],
        keywords: [
            'pistachio chocolate snacks',
            'almond chocolate snacks',
            'hazelnut chocolate sticks',
            'gourmet nut pairings',
        ],
    },
    {
        id: '3',
        slug: 'luxury-snack-trends-elevating-dessert-experience',
        title: 'Luxury Snack Trends: Elevating Everyday Dessert Moments with Crizbe',
        excerpt:
            'How premium ingredient sourcing, aesthetic packaging, and portion-conscious indulgence are reshaping modern snacking habits.',
        content: `
            <p className="lead">Modern consumers are shifting from bulk consumption to mindful, high-quality indulgence. 'Once in a while luxury' is more than a slogan—it is a lifestyle choice centered around quality over quantity.</p>
            
            <h2>Mindful Portioning Without Compromising Taste</h2>
            <p>Slender wafer sticks allow you to savor authentic Belgian cocoa and real nut creams without the heavy feeling of dense candy bars. Each stick provides an exquisite burst of flavor and crispiness.</p>
            
            <h2>Elevating Hostess & Corporate Gifting</h2>
            <p>Elegantly packaged chocolates have become the preferred choice for dinner party gifts, client appreciation packages, and holiday hampers. Crizbe sleek packaging brings sophistication to any presentation.</p>
        `,
        category: 'Lifestyle & Trends',
        author: {
            name: 'Crizbe Editorial',
            role: 'Lifestyle Writer',
            avatar: '/images/user/og-image.jpeg',
        },
        publishedAt: '2026-07-25',
        readTime: '3 min read',
        coverImage: '/images/user/almond-bottle.png',
        tags: ['Luxury Snacks', 'Dessert Trends', 'Gifting', 'Crizbe Lifestyle'],
        keywords: [
            'luxury chocolate snacks',
            'premium dessert trends',
            'corporate chocolate gifts',
            'Once in a while luxury',
        ],
    },
];
