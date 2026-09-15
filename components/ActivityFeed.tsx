export default function ActivityFeed({items}:{items:{title:string, meta?:string}[]}){
  return (
    <div className="container-card p-4 rounded-lg">
      <div className="card-header">
        <div>
          <div className="card-title">Atividades Recentes</div>
          <div className="card-sub">Últimas ações relacionadas</div>
        </div>
        <div className="text-sm text-muted/80">Ver tudo</div>
      </div>
      <ul className="space-y-3 text-sm">
        {items.map((it, idx)=> (
          <li key={idx} className="flex justify-between items-start">
            <div>
              <div className="font-medium">{it.title}</div>
              {it.meta && <div className="text-muted/70 text-xs">{it.meta}</div>}
            </div>
            <div className="text-xs text-muted/70">{it.meta? ' ' : 'agora'}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
