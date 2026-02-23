const { MercadoPagoConfig, Preference } = require('mercadopago');

const accessToken = 'APP_USR-951843739246430-112418-aaef385e90a462488b8d52a815192551-3013801615';
const client = new MercadoPagoConfig({ accessToken: accessToken });

async function test(url) {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    { id: '123', title: 'Test Item', quantity: 1, unit_price: 100 },
                ],
                back_urls: {
                    success: `${url}/success`,
                    failure: `${url}/failure`,
                    pending: `${url}/pending`,
                },
                auto_return: 'approved'
            },
        });
        console.log(`URL ${url} -> SUCCESS! Init Point: ${result.init_point}`);
    } catch (error) {
        console.error(`URL ${url} -> ERROR:`, error.message);
    }
}

async function run() {
    await test('http://localhost:3000');
    await test('http://127.0.0.1:3000');
    await test('https://localhost:3000');
    await test('https://ecomerce-full.vercel.app');
}

run();
