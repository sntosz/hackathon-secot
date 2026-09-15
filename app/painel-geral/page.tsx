import Header from "../../components/Header";
import PageTabs from "../../components/PageTabs";
import MetricCard from "../../components/MetricCard";
import ProgressList from "../../components/ProgressList";
import ActivityFeed from "../../components/ActivityFeed";
import SideSummary from "../../components/SideSummary";
import { summary } from "../../lib/mock";

const progressItems = [
  { label: 'Ensino (Cursos, Palestras)', hours: '40h / 60h' },
  { label: 'Pesquisa (Iniciação Científica)', hours: '20h / 40h' },
  { label: 'Extensão (Projetos, Organização)', hours: '15h / 60h' },
  { label: 'Outras Atividades', hours: '12h / 50h' },
]

const feed = [
  { title: 'Curso de Extensão: React & Redux homologado', meta: '14/03/2025' },
  { title: 'Solicitação de validação enviada', meta: '02/03/2025' },
]

export default function PainelGeral(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <PageTabs active="painel-geral" />
        <div className="flex gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold">Área do Aluno · Painel de Controle de Horas Complementares</h1>
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                <MetricCard title="Horas homologadas" value={summary.homologated} note={`${summary.homologated}h / ${summary.requiredHours}h`} />
                <MetricCard title="Horas em Análise" value={45} note="Aguardando validação" />
                <MetricCard title="Relatórios" value={12} note="Exportar / Imprimir" />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ProgressList items={progressItems} />
              </div>
              <div>
                <ActivityFeed items={feed} />
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
