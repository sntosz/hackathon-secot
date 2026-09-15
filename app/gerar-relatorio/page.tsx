import Header from "../../components/Header";
import PageTabs from "../../components/PageTabs";
import SideSummary from "../../components/SideSummary";
import TablePolish from "../../components/TablePolish";
import { summary } from "../../lib/mock";

export default function GerarRelatorio(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <PageTabs active="gerar-relatorio" />
        <div className="flex gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-4">Exportação e Emissão de Relatório de Horas</h1>
            <div className="grid grid-cols-2 gap-4">
              <div className="container-card p-4 rounded">
                <label className="text-sm">Formato</label>
                <select className="w-full bg-panel p-2 rounded mt-2">
                  <option>PDF</option>
                  <option>CSV</option>
                </select>
                <label className="text-sm mt-3 block">Período</label>
                <input className="w-full bg-panel p-2 rounded mt-2" placeholder="01/01/2024 - 31/12/2024" />
                <div className="mt-4">Horas homologadas: <strong>{summary.homologated}h</strong></div>
                <button className="mt-4 px-4 py-2 bg-accent text-black rounded">Exportar Relatório</button>
              </div>

              <div className="container-card p-4 rounded">
                <h3 className="font-semibold">Pré-visualização</h3>
                <div className="mt-3 text-sm text-muted/70">Aqui será apresentada uma pré-visualização do relatório com somatório de horas homologadas e detalhes.</div>
                <div className="mt-6 bg-gray-900 p-3 rounded">
                  <div className="text-sm">SOMA DE HORAS HOMOLOGADAS</div>
                  <div className="text-lg font-bold mt-2">{summary.homologated}h / {summary.requiredHours}h</div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-96">
            <SideSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
