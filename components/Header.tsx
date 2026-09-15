import Link from "next/link";

export default function Header(){
    return (
        <header className="w-full bg-panel text-gray-100 p-4 flex items-center justify-between border-b border-gray-800">
            <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-brand rounded text-sm font-semibold">UFSCar Horas</div>
                <nav className="hidden md:flex gap-2 text-sm opacity-90 items-center">
                    <Link href="/painel-geral" className="px-3 py-2 hover:bg-surface rounded">Painel Geral</Link>
                    <Link href="/painel-validacao-docente" className="px-3 py-2 hover:bg-surface rounded">Validação Docente</Link>
                    <Link href="/meus-certificados" className="px-3 py-2 hover:bg-surface rounded">Meus Certificados</Link>
                    <Link href="/gerar-relatorio" className="px-3 py-2 hover:bg-surface rounded">Gerar Relatório</Link>
                    <Link href="/portal-secretaria" className="px-3 py-2 hover:bg-surface rounded">Portal Secretaria</Link>
                </nav>
            </div>
            <div className="text-sm opacity-80 flex items-center gap-3">
                <div className="text-xs bg-surface px-2 py-1 rounded">Aluno: Lucas F. Silva</div>
                <div className="text-xs opacity-70">Ano Letivo: 2025</div>
            </div>
        </header>
    )
}
