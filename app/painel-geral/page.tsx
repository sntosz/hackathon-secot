import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import DashboardGrid from "../../components/DashboardGrid";
import { summary } from "../../lib/mock";

export default function PainelGeral(){
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="max-w-7xl mx-auto p-6 flex gap-6">
        <Sidebar />
        <section className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Painel Geral</h1>
            <div className="text-sm opacity-80">Progresso: {Math.round((summary.homologated/summary.requiredHours)*100)}%</div>
          </div>
          <DashboardGrid />

          <div className="mt-8 bg-gray-900 p-4 rounded-lg">
            <h2 className="font-semibold">Resumo do Aluno</h2>
            <div className="mt-2 text-sm grid grid-cols-3 gap-4">
              <div className="p-3 bg-gray-800 rounded">Total homologado<br/><span className="text-xl font-bold">{summary.homologated}h</span></div>
              <div className="p-3 bg-gray-800 rounded">Horas requeridas<br/><span className="text-xl font-bold">{summary.requiredHours}h</span></div>
              <div className="p-3 bg-gray-800 rounded">Faltam<br/><span className="text-xl font-bold">{summary.pending}h</span></div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
