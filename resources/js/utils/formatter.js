/**
 * Utilities for formatting values
 */

export const formatRp = (num) => 'Rp ' + Number(num).toLocaleString('id-ID');

export const formatPaymentMethod = (trx) => {
    let text = trx.payment_method?.replace('_', ' ');
    if (!text) return '—';
    text = text.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    if (trx.payment_provider) {
        const provider = trx.payment_provider.toUpperCase();
        text += ` (${provider})`;
    }
    if (trx.payment_details) {
        if (trx.payment_method === 'transfer' && trx.payment_details.account_name) {
            text += ` - a.n. ${trx.payment_details.account_name}`;
            if (trx.payment_details.account_number) {
                text += ` (${trx.payment_details.account_number})`;
            }
        } else if (trx.payment_method === 'ewallet' && trx.payment_details.phone_number) {
            text += ` - ${trx.payment_details.phone_number}`;
        }
    }
    return text;
};
