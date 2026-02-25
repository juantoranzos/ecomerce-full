import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Política de Privacidad | Yo Te Importo',
    description: 'Política de privacidad y tratamiento de datos personales en Yo Te Importo.',
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Política de Privacidad</h1>
                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="mb-4"><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Tratamiento de Datos Personales</h2>
                    <p className="mb-4">
                        En cumplimiento de la Ley Nacional de Protección de Datos Personales N° 25.326 de la República Argentina, le informamos que los datos recabados en este sitio web serán incorporados a una base de datos bajo la responsabilidad de (COMPLETAR NOMBRE O RAZÓN SOCIAL).
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Finalidad de los Datos</h2>
                    <p className="mb-4">
                        Sus datos serán utilizados exclusivamente con la finalidad de gestionar sus pedidos, facturación, envío de los productos adquiridos y mantenerle informado sobre novedades de nuestra tienda si así lo consintiera.
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Derechos del Titular (AAIP)</h2>
                    <p className="mb-4">
                        El titular de los datos personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita a intervalos no inferiores a seis meses, salvo que se acredite un interés legítimo al efecto conforme lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326.
                    </p>
                    <p className="mb-4">
                        La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de Órgano de Control de la Ley N° 25.326, tiene la atribución de atender las denuncias y reclamos que interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas vigentes en materia de protección de datos personales.
                    </p>

                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
                        <p className="text-sm text-yellow-700">
                            <strong>Nota para el administrador:</strong> Este texto es una plantilla básica. Consúltelo con un profesional legal para garantizar el pleno cumplimiento de la Ley 25.326 y la normativa de la AAIP.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
