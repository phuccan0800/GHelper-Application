const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

exports.createCustomer = async (email, name) => {
    return await stripe.customers.create({
        email,
        name,
        description: `Customer for ${email}`,
    });
};

exports.attachPaymentMethod = async (paymentMethodId, customerId) => {
    return await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId,
    });
};

exports.updateCustomerDefaultPaymentMethod = async (customerId, paymentMethodId) => {
    return await stripe.customers.update(customerId, {
        invoice_settings: {
            default_payment_method: paymentMethodId,
        },
    });
};

exports.getCustomerPaymentMethods = async (customerId) => {
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) {
        throw new Error('Customer not found');
    }
    const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;

    const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
    });

    return paymentMethods.data.map(pm => ({
        id: pm.id,
        brand: pm.card.brand,
        last4: pm.card.last4,
        expMonth: pm.card.exp_month,
        expYear: pm.card.exp_year,
        cardholderName: pm.billing_details.name,
        isDefault: pm.id === defaultPaymentMethodId,
    }));
};

exports.getPaymentMethodById = async (paymentMethodId) => {

    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
    const customer = await stripe.customers.retrieve(paymentMethod.customer);
    const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;
    return {
        id: paymentMethod.id,
        brand: paymentMethod.card.brand,
        last4: paymentMethod.card.last4,
        expMonth: paymentMethod.card.exp_month,
        expYear: paymentMethod.card.exp_year,
        cardholderName: paymentMethod.billing_details.name,
        isDefault: paymentMethod.id === defaultPaymentMethodId,
    }
};

exports.detachPaymentMethod = async (paymentMethodId) => {
    return await stripe.paymentMethods.detach(paymentMethodId);
};

exports.setDefaultPaymentMethod = async (paymentMethodId) => {
    try {
        const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);
        const customer = await stripe.customers.retrieve(paymentMethod.customer);
        const defaultPaymentMethodId = customer.invoice_settings.default_payment_method;
        if (paymentMethodId === defaultPaymentMethodId) {
            throw new Error('Payment method is already the default');
        }
        if (!customer) {
            throw new Error('Customer not found');
        }
        return await stripe.customers.update(customer.id, {
            invoice_settings: {
                default_payment_method: paymentMethodId,
            },
        });
    } catch (error) {
        throw error;
    }
};

exports.createPaymentIntent = async (customerId, amount, paymentMethodId) => {
    try {
        console.log(customerId, amount, paymentMethodId)
        return await stripe.paymentIntents.create({
            customer: customerId,
            amount: amount,
            currency: 'vnd',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        throw error;
    }
};

exports.refundPaymentIntent = async (paymentIntentId) => {
    try {
        // Lấy PaymentIntent để lấy charge_id
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
        if (paymentIntent.status !== 'succeeded') {
            throw new Error('PaymentIntent is not succeeded.');
        }
        const refund = await stripe.refunds.create({
            charge: paymentIntent.latest_charge,
        });

        return refund;
    } catch (error) {
        console.error('Error refunding payment intent:', error);
        throw error;
    }
};

exports.getPaymentIntent = async (paymentIntentId) => {
    try {
        // Lấy PaymentIntent
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (!paymentIntent) {
            throw new Error('PaymentIntent not found.');
        }

        // Lấy Charge ID từ PaymentIntent
        const chargeId = paymentIntent.latest_charge;
        if (!chargeId) {
            throw new Error('No Charge ID found for this PaymentIntent.');
        }

        // Lấy chi tiết Charge
        const charge = await stripe.charges.retrieve(chargeId);

        // Lấy Refunds từ Charge
        const refunds = charge.refunds;

        // Trả về thông tin đầy đủ
        return {
            paymentIntent,
            charge,
            refunds,
        };
    } catch (error) {
        console.error('Error retrieving payment details:', error.message);
        throw error;
    }
};
