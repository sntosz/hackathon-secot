import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { summary } from "../../lib/mock";

export default function GerarRelatorio(){
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="max-w-5xl mx-auto p-6 flex gap-6">
        <Sidebar />
        <section className="flex-1">
          <h1 className="text-2xl font-semibold mb-4">Exportação e Emissão de Relatório de Horas</h1>

          <div className="bg-gray-900 p-6 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Formato</label>
                <select className="w-full bg-gray-800 p-2 rounded">
                  <option>PDF</option>
                  <option>CSV</option>
                </select>
              </div>
              <div>
                <label className="block text-sm mb-2">Período</label>
                <input className="w-full bg-gray-800 p-2 rounded" placeholder="01/01/2024 - 31/12/2024" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div>Horas homologadas: <span className="font-bold">{summary.homologated}h</span></div>
              <button className="px-4 py-2 bg-indigo-600 rounded">Exportar Relatório</button>
            </div>

          </div>

        </section>
      </main>
    </div>
  )
}
