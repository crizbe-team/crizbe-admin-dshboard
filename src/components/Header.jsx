'use client';

import Image from 'next/image'
import React from 'react'
import { Bell } from 'lucide-react'
import admin from "../../public/assets/images/admin.png"
import down from "../../public/assets/images/down.png"
import flag from "../../public/assets/images/world.png"
import { useSidebar } from '@/contexts/SidebarContext'


function Header() {
    const { isCollapsed } = useSidebar();

    return (
        <header className={`fixed top-0 right-0 border-b border-[#1f1f1f] z-30 transition-all duration-300 ${isCollapsed ? 'lg:left-20' : 'lg:left-64'} left-0 h-16`}>
            <div className="w-full h-full py-4 px-4 sm:px-6 flex items-center justify-between bg-[#1e1e1e] shadow-lg">
                <h1 className="text-lg sm:text-2xl font-semibold text-gray-100">
                    Dashboard
                </h1>
                <div className='flex items-center space-x-3 sm:space-x-6'>
                    <div className='flex items-center'>
                        <div className='mr-[2px]'>
                            <Image
                                src={flag}
                                alt="country flag"
                                width={25}
                                height={18}
                                className='rounded-full shadow-md cursor-pointer'
                            />
                        </div>
                        <div className='invert w-[20px]'>
                            <Image
                                src={down}
                                alt="rotating arrow"
                                width={25}
                                height={18}
                                className='cursor-pointer'
                            />
                        </div>
                    </div>
                    <div className='relative'>
                        <Bell className='w-5 sm:h-6 text-gray-300 cursor-pointer hover:text-white' />
                    </div>
                    <div className='flex items-center mr-[8px] sm:mr-[8px]'>
                        <Image
                            src={admin}
                            alt="admin"
                            width={35}
                            height={35}
                            className='rounded-full border border-gray-600'
                        />
                    </div>
                    <span className='hidden sm:block text-gray-100 font-medium'>John Mark</span>
                </div>
            </div>
        </header>
    )
}

export default Header