import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';

// Setup Inertia + React
// Secara otomatis menemukan component dari folder Pages/
createInertiaApp({
    // 'name' adalah nama halaman yang dikirim oleh Inertia::render()
    // misal: Inertia::render('Home') → akan load Pages/Home.jsx
    resolve: name => {
        const pages = import.meta.glob('./Pages/**/*.jsx', { eager: true });
        return pages[`./Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
});
