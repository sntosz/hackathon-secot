import Header from "../../components/Header";
import PageTabs from "../../components/PageTabs";
import TablePolish from "../../components/TablePolish";
import SideSummary from "../../components/SideSummary";
import { certificates } from "../../lib/mock";

export default function MeusCertificados(){
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-7xl mx-auto p-6">
        <PageTabs active="meus-certificados" />
        <div className="flex gap-6">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold mb-4">Meus Certificados Enviados</h1>
            <TablePolish>
              <table className="w-full text-sm">
                <thead className="text-left text-muted/80">
                  <tr>
                    <th className="p-2">Título</th>
                    <th className="p-2">Categoria</th>
                    <th className="p-2">Emissor</th>
                    <th className="p-2">Data</th>
                    <th className="p-2">Horas</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {certificates.map(c => (
                    <tr key={c.id} className="border-t border-gray-800">
                      <td className="p-2">{c.title}</td>
                      <td className="p-2">{c.category}</td>
                      <td className="p-2">{c.issuer}</td>
                      <td className="p-2">{c.date}</td>
                      <td className="p-2">{c.hours}</td>
                      <td className="p-2"><span className={`px-2 py-1 rounded ${c.status==='HOMOLOGADO'? 'bg-green-700':'bg-yellow-700'}`}>{c.status}</span></td>
                      <td className="p-2"><button className="btn btn-sm btn-ghost">Ver</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TablePolish>
          </div>

          <div className="w-96">
            <SideSummary />
          </div>
        </div>
      </main>
    </div>
  )
}
