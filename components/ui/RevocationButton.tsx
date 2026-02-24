'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

export function RevocationButton() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <button className="fixed bottom-4 left-4 z-50 flex items-center gap-2 bg-white text-gray-700 shadow-md border hover:bg-gray-50 border-gray-200 px-4 py-2 rounded-full text-sm font-medium transition-all group">
                    <AlertCircle className="w-4 h-4 text-gray-500 group-hover:text-red-500 transition-colors" />
                    <span className="hidden sm:inline-block">Botón de Arrepentimiento</span>
                    <span className="inline-block sm:hidden">Arrepentimiento</span>
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <AlertCircle className="w-6 h-6 text-red-500" />
                        Botón de Arrepentimiento
                    </DialogTitle>
                    <DialogDescription className="text-gray-600 pt-2">
                        Según la normativa vigente (Res. 424/2020), tienes derecho a cancelar tu compra o revocar la aceptación del servicio dentro de los 10 días desde que lo recibiste o lo contrataste (lo que ocurra último).
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                        Para proceder con el arrepentimiento de tu compra, contáctanos a través de:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 flex flex-col gap-3">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Email Directo</span>
                            <a href="mailto:juandeveloper001@gmail.com?subject=Revocación de Compra&body=Hola, quiero solicitar la revocación de la compra NRO: [INSERTAR NUMERO DE ORDEN AQUI]." className="text-blue-600 hover:underline font-medium break-words mt-1">
                                juandeveloper001@gmail.com
                            </a>
                        </div>
                        <div className="flex flex-col pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">Requisitos</span>
                            <span className="text-sm text-gray-700 mt-1">Por favor incluye el número de tu orden y el nombre bajo el que hiciste la compra.</span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4 text-center">
                        Procesaremos tu solicitud en un plazo de 24 horas hábiles brindándote un número de trámite.
                    </p>
                </div>

                <div className="flex justify-end border-t border-gray-100 pt-4">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cerrar
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
