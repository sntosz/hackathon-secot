import Link from "next/link";

export default function Header(){
    return (
        <header className="w-full bg-gray-900 text-gray-100 p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-600 rounded text-sm font-semibold">UFSCar Horas</div>
                <nav className="hidden md:flex gap-2 text-sm opacity-90">
                    <Link href="/painel-geral" className="px-3 py-2 hover:bg-gray-800 rounded">Painel Geral</Link>
                    <Link href="/painel-validacao-docente" className="px-3 py-2 hover:bg-gray-800 rounded">Validação Docente</Link>
                    <Link href="/meus-certificados" className="px-3 py-2 hover:bg-gray-800 rounded">Meus Certificados</Link>
                    <Link href="/gerar-relatorio" className="px-3 py-2 hover:bg-gray-800 rounded">Gerar Relatório</Link>
                    <Link href="/portal-secretaria" className="px-3 py-2 hover:bg-gray-800 rounded">Portal Secretaria</Link>
                </nav>
            </div>
            <div className="text-sm opacity-80">Aluno: Lucas Ferreira Silva</div>
        </header>
    )
}
