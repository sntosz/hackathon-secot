import MetricCard from "./MetricCard";
import ProgressList from "./ProgressList";
import ActivityFeed from "./ActivityFeed";
import { summary } from "../lib/mock";

export default function SideSummary(){
  const progressItems = [
    {label: 'Ensino (Cursos, Palestras)', hours: '40h / 60h'},
    {label: 'Extensão (Projetos)', hours: '20h / 40h'},
    {label: 'Pesquisa (Iniciação Científica)', hours: '12h / 30h'},
  ];

  const feed = [
    {title: 'Organização de Evento: IX SECOMP homologado', meta: '12/03/2025'},
    {title: 'Curso de Extensão: React & Redux', meta: '14/03/2025'},
  ];

  return (
    <aside className="space-y-4">
      <div className="container-card p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted/80">PROGRESSO DO ALUNO</div>
            <div className="text-2xl font-bold">{summary.totalHours}h</div>
            <div className="text-sm text-muted/80">Meta: {summary.requiredHours}h</div>
          </div>
          <div className="text-sm">
            <div className="px-2 py-1 bg-green-700 rounded text-xs">Submeter Novo Certificado</div>
          </div>
        </div>
      </div>

      <MetricCard title="Horas homologadas" value={summary.homologated} note={`${summary.homologated}h / ${summary.requiredHours}h`} />

      <ProgressList items={progressItems} />

      <ActivityFeed items={feed} />
    </aside>
  )
}
