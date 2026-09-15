export default function ProgressList({items}:{items:{label:string, hours:string}[]}){
  return (
    <div className="container-card p-4 rounded-lg">
      <div className="card-header">
        <div>
          <div className="card-title">Progresso Estimado por Categoria</div>
          <div className="card-sub">Progresso geral</div>
        </div>
        <div className="text-sm text-muted/80">Progresso geral: 41.4%</div>
      </div>
      <div className="space-y-3">
        {items.map((it, idx)=> (
          <div key={idx}>
            <div className="flex justify-between text-sm text-muted/80"><div>{it.label}</div><div>{it.hours}</div></div>
            <div className="w-full bg-gray-800 h-2 rounded mt-1 overflow-hidden">
              <div className="bg-accent h-2 rounded" style={{width: Math.min(100, (parseInt(it.hours)||0))*0.6 + '%'}}></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
