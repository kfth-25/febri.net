import api from './api';
import { saveUnpaidBill } from './billingService';

export const getMySubscriptions = async () => {
    const response = await api.get('/subscriptions');
    return response.data;
};

export const createSubscription = async (data) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    const existing = localStorage.getItem('installation_requests');
    const list = existing ? JSON.parse(existing) : [];
    const newRequest = {
        id: list.length + 1,
        created_at: new Date().toISOString(),
        status: 'pending',
        ...data
    };
    list.push(newRequest);
    localStorage.setItem('installation_requests', JSON.stringify(list));
    return newRequest;
};

export const requestSubscription = async (packageId) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Store in localStorage for demo purposes
    const packages = [
        { id: 1, name: 'Starter Home', speed: '20 Mbps', price: 250000 },
        { id: 2, name: 'Family Entertainment', speed: '50 Mbps', price: 350000 },
        { id: 3, name: 'Gamer & Creator', speed: '100 Mbps', price: 550000 },
        { id: 4, name: 'Ultra Speed', speed: '200 Mbps', price: 850000 }
    ];
    
    const selectedPkg = packages.find(p => p.id === packageId);
    
    if (selectedPkg) {
        const now = new Date();
        const monthLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
        const due = new Date(now);
        due.setDate(due.getDate() + 7);

        const unpaidBill = {
            id: Date.now(),
            month: monthLabel,
            dueDate: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            amount: selectedPkg.price,
            status: 'Belum Bayar',
            details: selectedPkg.name
        };

        saveUnpaidBill(unpaidBill);

        localStorage.setItem('pending_subscription', JSON.stringify({
            ...selectedPkg,
            requestDate: now.toISOString(),
            status: 'pending'
        }));
    }

    return { status: 'success', message: 'Permintaan berlangganan berhasil dikirim' };
};

export const getPendingSubscription = () => {
    const pending = localStorage.getItem('pending_subscription');
    return pending ? JSON.parse(pending) : null;
};
