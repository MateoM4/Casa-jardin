"use client"
import {ColumnDef} from "@tanstack/react-table";
import {Button} from "@/components/ui/button";
import {SquareArrowOutUpRight} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


export type SolicitudData = {
    codigo: number;
    estado: string; //revisada, no leida
}

//defino las columnas que va a tener la tabla
export const createColumns= (
    onViewDetails: (solicitudId: number) => void,
    ): ColumnDef<SolicitudData>[] => [
    
    {
        accessorKey: 'codigo',
        header: 'Código',
    },
    {
        accessorKey: 'estado',
        header: 'Estado',
    },
    {
        header: 'Acciones',
        id: 'acciones',
        cell: ({ row }) => {
            const solicitud = row.original; //variable que contiene la fila actual
            return (
              <>
                <Button
                  variant="link"
                  size="icon"
                  onClick={() => onViewDetails(solicitud.codigo)}
                  className="text-gray-600 hover:text-sky-600"
                >
                  <SquareArrowOutUpRight />
                </Button>
              </>
            );
        },
    },        
];
