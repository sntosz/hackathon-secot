export default function ValidationList({items}:{items:{id:number,title:string,category?:string,hours:number,status:string}[]}){
  return (
    <div className="container-card p-4 rounded-lg">
      <div className="card-header">
        <div>
          <div className="card-title">Certificados e Comprovações</div>
          <div className="card-sub">(Itens pendentes de parecer)</div>
        </div>
        <div className="text-sm text-muted/80">Filtrar por: Todas as Categorias</div>
      </div>

      <div className="space-y-3">
        {items.map(i => (
          <div key={i.id} className="flex items-start gap-3 p-3 rounded border border-transparent hover:border-gray-800">
            <div className="flex-1">
              <div className="text-sm font-medium">{i.title}</div>
              <div className="text-xs text-muted/80 mt-1">{i.category || 'Evento'} — Curso — {i.hours}h</div>
              <div className="text-xs text-muted/70 mt-2">Identificador: #{i.id} • Enviado por aluno • 02/03/2025</div>
            </div>
            <div className="w-48 text-right">
              <div className={`inline-block px-2 py-1 rounded text-xs ${i.status==='pendente'? 'bg-yellow-700':'bg-green-700'}`}>{i.status}</div>
              <div className="mt-3 flex justify-end gap-2">
                <button className="btn btn-sm btn-accent">Validar Atividade</button>
                <button className="btn btn-sm bg-red-700">Rejeitar</button>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  )
}
