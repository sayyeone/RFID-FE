import { useState, useEffect } from 'react';

export default function ContextualGreeting({ userName }) {
    const [greeting, setGreeting] = useState('');
    const [icon, setIcon] = useState('');

    useEffect(() => {
        const hour = new Date().getHours();
        if (hour < 12) {
            setGreeting('Selamat Pagi');
            setIcon('☀️');
        } else if (hour < 18) {
            setGreeting('Selamat Siang');
            setIcon('🌤️');
        } else {
            setGreeting('Selamat Malam');
            setIcon('🌙');
        }
    }, []);

    return (
        <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                {greeting}, {userName || 'Admin'}! {icon}
            </h1>
            <p className="text-gray-500 text-sm mt-1.5 font-medium">
                Ringkasan aktivitas hari ini untuk pengelolaan RFID Anda
            </p>
        </div>
    );
}
