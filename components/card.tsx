export default function Card(props : { name: string; subtitle: string; hours:number }) {
    return(
        <div className="bg-surface p-5 rounded-lg shadow-sm border border-gray-800 flex justify-between items-center">
            <div>
                <div className="text-sm text-muted/80 uppercase mb-1">{props.subtitle}</div>
                <h3 className="text-lg font-semibold text-gray-100">{props.name}</h3>
                <div className="text-xs text-muted/70 mt-2">Atualizado há 3 dias</div>
            </div>
            <div className="text-right">
                <div className="text-2xl font-bold text-accent">{props.hours}h</div>
                <div className="text-xs text-muted/60 mt-1">Concluídas</div>
            </div>
        </div>
    )
}
