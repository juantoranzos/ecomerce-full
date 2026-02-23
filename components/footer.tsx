export function Footer() {
    return (
        <footer className="border-t bg-gray-50">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4">YO TE IMPORTO</h3>
                        <p className="text-sm text-muted-foreground">
                            Productos premium para tu estilo de vida. Diseño minimalista, máxima calidad.
                        </p>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Tienda</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Todos los Productos</li>
                            <li>Nuevos Arribos</li>
                            <li>Destacados</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Soporte</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Preguntas Frecuentes</li>
                            <li>Envíos</li>
                            <li>Devoluciones</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-semibold mb-4">Conectar</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>Instagram</li>
                            <li>Twitter</li>
                            <li>Facebook</li>
                        </ul>
                    </div>
                </div>
                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} YO TE IMPORTO. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
