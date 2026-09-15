import Card from "./card";

export default function DashboardGrid(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card name="Horas Aproveitadas" subtitle="Resumo das atividades" hours={135} />
            <Card name="Atividades Pendentes" subtitle="Aguardando validação" hours={20} />
            <Card name="Relatórios" subtitle="Exportar ou imprimir" hours={12} />
        </div>
    )
}
