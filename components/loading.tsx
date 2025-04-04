'use client';

import Image from 'next/image';
import Gif from '@/public/gif.gif';

export const Loading = () => {
    return (
        <div className="min-h-screen items-center justify-center bg-white flex flex-col">
            <Image src={Gif} alt="Loading" width={100} height={100} className="mb-6 object-fill mx-auto" />
            <p className="text-green-800 text-base font-semibold">Carregando...</p>
        </div>
    );
};
