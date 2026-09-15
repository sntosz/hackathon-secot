import Link from "next/link";
import Header from "../components/Header";

export default function Home(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-4">UFSCar Horas — Painéis</h1>
        <p className="text-muted/80 mb-6">Navegue para visualizar os painéis simulados baseados no mock.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/painel-geral" className="block p-4 bg-surface rounded border border-gray-800">Painel Geral</Link>
          <Link href="/painel-validacao-docente" className="block p-4 bg-surface rounded border border-gray-800">Painel Validação Docente</Link>
          <Link href="/meus-certificados" className="block p-4 bg-surface rounded border border-gray-800">Meus Certificados</Link>
          <Link href="/gerar-relatorio" className="block p-4 bg-surface rounded border border-gray-800">Gerar Relatório</Link>
        </div>
      </main>
    </div>
  )
}
