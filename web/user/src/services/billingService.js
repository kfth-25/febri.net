const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getBillingHistory = async () => {
    await delay(800);
    const stored = localStorage.getItem('billing_history');
    return stored ? JSON.parse(stored) : [];
};

export const getUnpaidBill = async () => {
    await delay(500);
    const stored = localStorage.getItem('unpaid_bill');
    return stored ? JSON.parse(stored) : null;
};

export const saveUnpaidBill = (bill) => {
    localStorage.setItem('unpaid_bill', JSON.stringify(bill));
};

export const addBillingHistoryItem = async (item) => {
    const stored = localStorage.getItem('billing_history');
    const history = stored ? JSON.parse(stored) : [];
    const newHistory = [item, ...history];
    localStorage.setItem('billing_history', JSON.stringify(newHistory));
    return newHistory;
};

export const clearUnpaidBill = () => {
    localStorage.removeItem('unpaid_bill');
};
