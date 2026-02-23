const { MercadoPagoConfig, Preference } = require('mercadopago');
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-951843739246430-112418-aaef385e90a462488b8d52a815192551-3013801615' });

async function test(url) {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [{ id: '123', title: 'Test Item', quantity: 1, unit_price: 100 }],
                back_urls: {
                    success: `${url}/success`,
                    failure: `${url}/failure`,
                    pending: `${url}/pending`,
                }
            },
        });
        console.log(`URL ${url} without auto_return -> SUCCESS! Init Point: ${result.init_point}`);
    } catch (error) {
        console.error(`URL ${url} without auto_return -> ERROR:`, error.message);
    }
}
test('http://localhost:3000');
