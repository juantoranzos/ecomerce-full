import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Términos y Condiciones | Yo Te Importo',
    description: 'Términos y condiciones de uso y compra en Yo Te Importo.',
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Términos y Condiciones</h1>
                <div className="prose prose-blue max-w-none text-gray-600">
                    <p className="mb-4"><strong>Última actualización:</strong> {new Date().toLocaleDateString('es-AR')}</p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Información del Proveedor</h2>
                    <p className="mb-4">
                        (COMPLETAR CON: Razón Social / Nombre y Apellido, CUIT, Domicilio Legal, Email de contacto).
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Condiciones de Venta</h2>
                    <p className="mb-4">
                        Al realizar una compra en nuestro sitio, usted acepta que... (Completar con condiciones específicas de venta, plazos de entrega, etc).
                    </p>

                    <h2 className="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Políticas de Devolución y Cambios</h2>
                    <p className="mb-4">
                        De acuerdo a la Ley de Defensa del Consumidor (Ley 24.240), usted tiene derecho a revocar la aceptación del producto dentro de los 10 días computados a partir de la celebración del contrato o de la entrega del producto, lo último que ocurra...
                    </p>

                    {/* Placeholder for more legal text */}
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8">
                        <p className="text-sm text-yellow-700">
                            <strong>Nota para el administrador:</strong> Este es un texto de prueba. Debe ser reemplazado por los términos y condiciones redactados por un asesor legal para cumplir con la normativa argentina vigente.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
