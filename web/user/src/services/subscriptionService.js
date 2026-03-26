import api from './api';
import { saveUnpaidBill } from './billingService';

export const getMySubscriptions = async () => {
    const response = await api.get('/subscriptions');
    return response.data;
};

export const createSubscription = async (data) => {
    // Call public endpoint for registration to handle guest auto-creation
    const response = await api.post('/register-installation', {
        wifi_package_id: data.wifi_package_id,
        installation_address: data.installation_address,
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        notes: data.notes
    });
    const subscription = response.data;

    const existing = localStorage.getItem('installation_requests');
    const list = existing ? JSON.parse(existing) : [];
    const newRequest = {
        id: subscription.id,
        created_at: subscription.created_at || new Date().toISOString(),
        status: subscription.status || 'pending',
        wifi_package_id: subscription.wifi_package_id,
        installation_address: subscription.installation_address,
        notes: subscription.notes,
        userId: data.userId || null,
        userEmail: data.userEmail || null
    };
    list.push(newRequest);
    localStorage.setItem('installation_requests', JSON.stringify(list));
    return newRequest;
};

export const requestSubscription = async (pkg) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    if (!pkg) {
        return { status: 'error', message: 'Paket tidak valid' };
    }

    const now = new Date();
    const monthLabel = now.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' });
    const due = new Date(now);
    due.setDate(due.getDate() + 7);

    const unpaidBill = {
        id: Date.now(),
        month: monthLabel,
        dueDate: due.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
        amount: pkg.price,
        status: 'Belum Bayar',
        details: pkg.name
    };

    saveUnpaidBill(unpaidBill);

    localStorage.setItem('pending_subscription', JSON.stringify({
        id: pkg.id,
        name: pkg.name,
        speed: pkg.speed,
        price: pkg.price,
        requestDate: now.toISOString(),
        status: 'pending'
    }));

    return { status: 'success', message: 'Permintaan berlangganan berhasil dikirim' };
};

export const getPendingSubscription = () => {
    const pending = localStorage.getItem('pending_subscription');
    return pending ? JSON.parse(pending) : null;
};
