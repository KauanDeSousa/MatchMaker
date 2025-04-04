import { ReactNode } from 'react';

export const Header = ({ titulo, children }: { titulo: string; children?: ReactNode }) => {
    return (
        <header className="sticky top-0 left-0 w-full h-16 border-b bg-white flex items-center justify-between px-4">
            {children}
            <p className="text-base font-bold text-green-800">{titulo}</p>
        </header>
    );
};
