import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { activities } from "../../lib/mock";

export default function PainelValidacao(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-6xl mx-auto p-6 flex gap-6">
        <Sidebar />
        <section className="flex-1">
          <h1 className="text-2xl font-semibold mb-4">Painel de Validação da Secretaria e Comissão Docente</h1>
          <div className="space-y-4">
            {activities.map(a => (
              <div key={a.id} className="bg-surface p-4 rounded-lg flex justify-between items-center border border-gray-800">
                <div>
                  <div className="font-semibold">{a.title}</div>
                  <div className="text-sm text-muted/80">{a.hours} horas — status: <span className={a.status==='pendente'? 'text-yellow-400':'text-green-400'}>{a.status}</span></div>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-accent text-black rounded">Validar</button>
                  <button className="px-3 py-1 bg-red-700 rounded">Rejeitar</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
