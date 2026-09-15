export default function TablePolish({children}:{children:React.ReactNode}){
  return (
    <div className="container-card rounded-lg p-4">
      <div className="overflow-x-auto">{children}</div>
    </div>
  )
}
