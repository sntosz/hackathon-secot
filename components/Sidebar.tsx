import React from "react";
import Link from "next/link";

export default function Sidebar(){
    return (
        <aside className="w-72 bg-gray-850 text-gray-100 p-4 rounded-lg sticky top-4 h-[80vh] hidden lg:block">
            <div className="mb-4 font-semibold">Área do Aluno</div>
            <ul className="space-y-2 text-sm">
                <li><Link href="/painel-geral" className="block p-2 rounded hover:bg-gray-800">Painel de Controle</Link></li>
                <li><Link href="/meus-certificados" className="block p-2 rounded hover:bg-gray-800">Meus Certificados</Link></li>
                <li><Link href="/gerar-relatorio" className="block p-2 rounded hover:bg-gray-800">Exportar Relatório</Link></li>
                <li><Link href="/portal-secretaria" className="block p-2 rounded hover:bg-gray-800">Portal Secretaria</Link></li>
            </ul>
        </aside>
    )
}
