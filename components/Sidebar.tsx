import React from "react";
import Link from "next/link";

export default function Sidebar(){
    return (
        <aside className="w-72 bg-surface text-gray-200 p-4 rounded-lg sticky top-4 h-[80vh] hidden lg:block border border-gray-800">
            <div className="mb-4 font-semibold">Área do Aluno</div>
            <ul className="space-y-2 text-sm">
                <li><Link href="/painel-geral" className="block p-2 rounded hover:bg-panel">Painel de Controle</Link></li>
                <li><Link href="/meus-certificados" className="block p-2 rounded hover:bg-panel">Meus Certificados</Link></li>
                <li><Link href="/gerar-relatorio" className="block p-2 rounded hover:bg-panel">Exportar Relatório</Link></li>
                <li><Link href="/portal-secretaria" className="block p-2 rounded hover:bg-panel">Portal Secretaria</Link></li>
            </ul>
        </aside>
    )
}
