import * as React from 'react';
import Link from 'next/link';
import { type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

interface LinkProps
    extends React.AnchorHTMLAttributes<HTMLAnchorElement>, VariantProps<typeof buttonVariants> {
    href: string;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, LinkProps>(
    ({ className, variant, size, href, ...props }, ref) => {
        return (
            <Link
                href={href}
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
ButtonLink.displayName = 'ButtonLink';

export { ButtonLink };
