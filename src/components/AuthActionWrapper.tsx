'use client';

import React, { useState, MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import { authUtils } from '@/utils/auth';
import AuthRequiredModal from '@/components/Modals/AuthRequiredModal';

interface AuthActionWrapperProps {
    children: React.ReactElement<any>;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
}

export default function AuthActionWrapper({ children, onClick }: AuthActionWrapperProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const pathname = usePathname();
    const isDisabled = Boolean(children.props?.disabled);

    const handleClick = (e: MouseEvent<HTMLElement>) => {
        if (isDisabled) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }

        if (!authUtils.isAuthenticated()) {
            e.preventDefault();
            e.stopPropagation();

            // Store current path so they come back after login
            Cookies.set('redirectAfterLogin', pathname || '/', {
                expires: 1 / 24, // 1 hour
                secure: process.env.NEXT_PUBLIC_SERVER === 'PRODUCTION',
                sameSite: 'strict',
                path: '/',
            });

            setIsModalOpen(true);
        } else {
            // If authenticated, execute the wrapper's onClick if provided
            if (onClick) {
                onClick(e);
            }
            // Also execute the child's original onClick if it exists
            if (children.props && typeof children.props.onClick === 'function') {
                children.props.onClick(e);
            }
        }
    };

    return (
        <>
            {React.cloneElement(children, {
                onClick: handleClick,
            })}
            <AuthRequiredModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </>
    );
}
