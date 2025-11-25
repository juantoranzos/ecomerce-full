const { MercadoPagoConfig, Preference } = require('mercadopago');

const accessToken = 'APP_USR-951843739246430-112418-aaef385e90a462488b8d52a815192551-3013801615';
const client = new MercadoPagoConfig({ accessToken: accessToken });

async function test() {
    try {
        const preference = new Preference(client);
        const result = await preference.create({
            body: {
                items: [
                    {
                        id: '123',
                        title: 'Test Item',
                        quantity: 1,
                        unit_price: 100,
                    },
                ],
            },
        });
        console.log('SUCCESS! Init Point:', result.init_point);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

test();
