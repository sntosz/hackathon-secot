import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";

export default function PortalSecretaria(){
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      <Header />
      <main className="max-w-6xl mx-auto p-6 flex gap-6">
        <Sidebar />
        <section className="flex-1">
          <h1 className="text-2xl font-semibold mb-4">Portal da Secretaria</h1>
          <div className="bg-gray-900 p-6 rounded-lg">
            <p className="text-sm opacity-80">Área de gerenciamento de validações, configurações e relatórios (simulada).</p>
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div className="p-4 bg-gray-800 rounded">Validar Atividades</div>
              <div className="p-4 bg-gray-800 rounded">Relatórios</div>
              <div className="p-4 bg-gray-800 rounded">Configurações</div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
