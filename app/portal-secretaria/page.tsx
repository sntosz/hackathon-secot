import Header from "../../components/Header";
import PageTabs from "../../components/PageTabs";
import SideSummary from "../../components/SideSummary";

export default function PortalSecretaria(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <PageTabs active="portal-secretaria" />
        <div className="flex gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-4">Portal da Secretaria</h1>
            <div className="grid grid-cols-3 gap-4">
              <div className="container-card p-4 rounded">Validar Atividades</div>
              <div className="container-card p-4 rounded">Gerenciar Relatórios</div>
              <div className="container-card p-4 rounded">Configurações</div>
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
