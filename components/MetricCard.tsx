export default function MetricCard({title, value, note}:{title:string; value:string|number; note?:string}){
  return (
    <div className="bg-surface p-4 rounded-lg border border-gray-800 flex items-center justify-between">
      <div>
        <div className="text-xs text-muted/80 uppercase">{title}</div>
        <div className="text-2xl font-bold mt-1">{value}</div>
        {note ? <div className="text-xs text-muted/70 mt-1">{note}</div> : null}
      </div>
      <div className="text-right">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-sm font-semibold">{String(value)}</div>
      </div>
    </div>
  )
}
