export default function PaginationControls({page, totalPages, onPrev, onNext, onJump}:{page:number,totalPages:number,onPrev:()=>void,onNext:()=>void,onJump:(n:number)=>void}){
  return (
    <div className="flex items-center gap-3 text-sm">
      <button onClick={onPrev} className="px-3 py-1 bg-[#121316] border border-zinc-800 rounded">Anterior</button>
      <span>Página {page} de {totalPages}</span>
      <button onClick={onNext} className="px-3 py-1 bg-[#121316] border border-zinc-800 rounded">Próxima</button>
      <div className="flex items-center gap-2">
        Ir para:
        <select value={page} onChange={e=>onJump(Number(e.target.value))} className="bg-[#0f1113] border border-zinc-800 rounded px-2 py-1">
          {Array.from({length: totalPages}).map((_,i)=>(<option key={i} value={i+1}>{i+1}</option>))}
        </select>
      </div>
    </div>
  )
}
