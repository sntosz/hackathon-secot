import Link from "next/link";

export default function PageTabs({active}:{active:string}){
  const tabs = [
    {id:'painel-geral', label:'Painel Geral', href:'/painel-geral'},
    {id:'meus-certificados', label:'Meus Certificados', href:'/meus-certificados'},
    {id:'gerar-relatorio', label:'Gerar Relatório', href:'/gerar-relatorio'},
    {id:'portal-secretaria', label:'Portal Secretaria', href:'/portal-secretaria'},
  ];

  return (
    <div className="flex items-center gap-3 mb-4">
      {tabs.map(t => (
        <Link key={t.id} href={t.href} className={`text-sm px-3 py-2 rounded ${t.id===active? 'bg-gray-800 border border-gray-700':'hover:bg-gray-800'}`}>
          {t.label}
        </Link>
      ))}
    </div>
  )
}
