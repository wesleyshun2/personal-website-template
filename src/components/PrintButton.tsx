'use client';

import { Printer } from 'lucide-react';

export function PrintButton({ label }: { label: string }) {
    return (
        <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full text-sm font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors print:hidden"
        >
            <Printer size={16} />
            {label}
        </button>
    );
}
