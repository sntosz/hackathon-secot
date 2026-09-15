export default function Badge({children, tone}:{children:React.ReactNode, tone?:'neutral'|'success'|'warning'|'danger'}){
  const cls = tone === 'success' ? 'bg-green-700' : tone==='warning' ? 'bg-yellow-700' : tone==='danger' ? 'bg-red-700' : 'bg-gray-700';
  return <span className={`text-xs px-2 py-1 rounded ${cls}`}>{children}</span>
}
