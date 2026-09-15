import MetricCard from "./MetricCard";

export default function DashboardGrid(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MetricCard title="Horas Aproveitadas" value={135} note="Concluídas" />
            <MetricCard title="Horas em Análise" value={45} note="Aguardando validação" />
            <MetricCard title="Horas Homologadas" value={87} note="Total homologado" />
        </div>
    )
}
