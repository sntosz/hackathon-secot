import Header from "../../components/Header";
import PageTabs from "../../components/PageTabs";
import ValidationList from "../../components/ValidationList";
import SideSummary from "../../components/SideSummary";
import { activities } from "../../lib/mock";

export default function PainelValidacao(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <PageTabs active="painel-validacao-docente" />
        <div className="flex gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-4">Painel de Validação da Secretaria e Comissão Docente</h1>
            <ValidationList items={activities.map(a => ({id:a.id,title:a.title,category:'Curso',hours:a.hours,status:a.status==='validado'? 'homologado':'pendente'}))} />
          </div>

          <div className="w-96">
            <SideSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
