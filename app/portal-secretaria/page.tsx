"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Header from "../../components/Header";
import { useHours } from "../../context/HoursContext";
import { 
  Search,
  Check
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Certificate } from "../../lib/types";
import useDebounced from '../../lib/useDebounced';
import ConfirmModal from '../../components/ConfirmModal';
import PaginationControls from '../../components/PaginationControls';

export default function PortalSecretaria() {
  const router = useRouter();
  const {
    certificates,
    setReviewingCertificate,
    setCurrentStudentByRa,
    addToast,
    resetDemoData,
    deferMultipleCertificates,
    rejectMultipleCertificates,
  } = useHours();

  const [activeTab, setActiveTab] = useState<"pendentes" | "aprovadas" | "indeferidas">("pendentes");
  const [searchQuery, setSearchQuery] = useState( () => {
    try { return localStorage.getItem('ufscar_horas_triage_search') || ''; } catch(e){ return ''; }
  });
  const debouncedSearch = useDebounced(searchQuery, 300);
  const [isLoading, setIsLoading] = useState(false);

  // Pagination
  const [page, setPage] = useState(() => {
    try { return Number(localStorage.getItem('ufscar_horas_triage_page')) || 1; } catch(e){ return 1; }
  });
  const [pageSize, setPageSize] = useState<number>(() => {
    try { return Number(localStorage.getItem('ufscar_horas_triage_pageSize')) || 10; } catch(e){ return 10; }
  });

  // Selection for bulk actions
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'approve'|'reject'|null>(null);

  // keyboard navigation
  const [focusedIndex, setFocusedIndex] = useState<number>(-1);
  const listRef = useRef<HTMLTableSectionElement|null>(null);

  // defensive
  const safeCertificates: Certificate[] = Array.isArray(certificates) ? certificates : [];

  const pendingCerts = useMemo(() => safeCertificates.filter(c => c.status === "PENDENTE"), [safeCertificates]);
  const approvedCerts = useMemo(() => safeCertificates.filter(c => c.status === "APROVADO"), [safeCertificates]);
  const rejectedCerts = useMemo(() => safeCertificates.filter(c => c.status === "INDEFERIDO"), [safeCertificates]);

  const baseList = useMemo(() => {
    if (activeTab === 'pendentes') return pendingCerts;
    if (activeTab === 'aprovadas') return approvedCerts;
    return rejectedCerts;
  }, [activeTab, pendingCerts, approvedCerts, rejectedCerts]);

  // Apply search (debounced) and pagination
  const filtered = useMemo(() => {
    if (!debouncedSearch.trim()) return baseList;
    const q = debouncedSearch.toLowerCase();
    return baseList.filter(i =>
      (i.studentName || '').toLowerCase().includes(q) ||
      (i.title || '').toLowerCase().includes(q) ||
      (i.studentRa || '').includes(q) ||
      (i.issuer || '').toLowerCase().includes(q)
    );
  }, [baseList, debouncedSearch]);

  useEffect(()=>{
    try{ localStorage.setItem('ufscar_horas_triage_search', searchQuery); }catch(e){}
  },[searchQuery]);
  useEffect(()=>{
    try{ localStorage.setItem('ufscar_horas_triage_page', String(page)); }catch(e){}
  },[page]);
  useEffect(()=>{
    try{ localStorage.setItem('ufscar_horas_triage_pageSize', String(pageSize)); }catch(e){}
  },[pageSize]);

  useEffect(()=>{
    // show loading indicator while debouncing
    setIsLoading(true);
    const t = setTimeout(()=> setIsLoading(false), 320);
    return ()=> clearTimeout(t);
  }, [debouncedSearch, page, pageSize, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  useEffect(()=>{ if(page > totalPages) setPage(1); },[totalPages]);

  const pageSlice = useMemo(()=>{
    const start = (page-1)*pageSize;
    return filtered.slice(start, start + pageSize);
  },[filtered,page,pageSize]);

  // bulk actions
  const toggleSelect = (id:string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]);
  const toggleSelectAll = () => {
    const ids = pageSlice.map(c=>c.id);
    const allSelected = ids.every(id=>selectedIds.includes(id));
    if(allSelected) setSelectedIds(prev => prev.filter(id=>!ids.includes(id)));
    else setSelectedIds(prev=>[...new Set([...prev,...ids])]);
  };

  const openConfirm = (action:'approve'|'reject') => { setConfirmAction(action); setConfirmOpen(true); };
  const doConfirm = () => {
    if(confirmAction === 'approve') {
      deferMultipleCertificates(selectedIds, 'Homologação em lote realizada pelo setor.');
      addToast(`${selectedIds.length} certificados homologados em lote.`, 'success');
    } else if(confirmAction === 'reject') {
      rejectMultipleCertificates(selectedIds, 'Indeferido em lote pelo setor.');
      addToast(`${selectedIds.length} certificados indeferidos em lote.`, 'warning');
    }
    setSelectedIds([]);
    setConfirmOpen(false);
    setConfirmAction(null);
  };

  // keyboard navigation (j/k)
  useEffect(()=>{
    const handler = (e:KeyboardEvent) => {
      if(['INPUT','TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if(e.key === 'j') setFocusedIndex(i => Math.min(i+1, pageSlice.length-1));
      if(e.key === 'k') setFocusedIndex(i => Math.max(i-1, 0));
      if(e.key === 'Enter' && focusedIndex >=0) {
        const cert = pageSlice[focusedIndex];
        if(cert) setReviewingCertificate(cert);
      }
    };
    window.addEventListener('keydown', handler);
    return ()=> window.removeEventListener('keydown', handler);
  },[pageSlice, focusedIndex, setReviewingCertificate]);

  const handleOpenPreview = (cert: Certificate) => setReviewingCertificate(cert);
  const handleNavigateToStudent = (ra:string) => { setCurrentStudentByRa(ra); router.push('/painel-validacao-docente'); };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-zinc-100 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">

        <div className="flex items-center justify-between gap-3">
          <h1 className="text-lg font-bold">Portal Administrativo — Triagem</h1>
          <div className="flex items-center gap-2">
            <button onClick={resetDemoData} className="text-xs text-zinc-400 hover:underline">Reset Demo</button>
          </div>
        </div>

        <section className="bg-[#111317] border border-zinc-800/80 rounded-2xl p-4">
          <div className="flex items-center gap-4 mb-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input value={searchQuery} onChange={e=>{ setSearchQuery(e.target.value); setPage(1); }} placeholder="Filtrar por aluno, RA, emissor ou título..." className="w-full bg-[#14161d] border border-zinc-700/70 rounded-lg pl-10 pr-3 py-2 text-sm text-white" />
            </div>
            <div className="flex items-center gap-2">
              <select value={pageSize} onChange={e=>{ setPageSize(Number(e.target.value)); setPage(1);}} className="bg-[#0f1113] border border-zinc-800 rounded px-2 py-1 text-sm">
                <option value={10}>10 / pág</option>
                <option value={20}>20 / pág</option>
                <option value={50}>50 / pág</option>
              </select>
              <div className="text-xs text-zinc-400">Exibindo {filtered.length} resultados</div>
            </div>
          </div>

          {/* Bulk actions bar */}
          {selectedIds.length > 0 && (
            <div className="bg-[#0f1113] border border-zinc-800 rounded p-3 mb-3 flex items-center justify-between">
              <div className="text-sm">{selectedIds.length} item(s) selecionado(s)</div>
              <div className="flex items-center gap-2">
                <button onClick={()=>openConfirm('approve')} className="px-3 py-1 bg-emerald-500 text-black rounded text-sm">Aprovar selecionados</button>
                <button onClick={()=>openConfirm('reject')} className="px-3 py-1 bg-rose-600 rounded text-sm">Indeferir selecionados</button>
                <button onClick={()=>setSelectedIds([])} className="px-3 py-1 bg-transparent border border-zinc-700 rounded text-sm">Limpar</button>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-zinc-800/80 text-zinc-400 font-semibold bg-[#14161d]">
                  <th className="py-3.5 px-4"> <input type="checkbox" onChange={toggleSelectAll} checked={pageSlice.length>0 && pageSlice.every(c=>selectedIds.includes(c.id))} aria-label="Selecionar todos"/> </th>
                  <th className="py-3.5 px-4">Estudante / RA</th>
                  <th className="py-3.5 px-4">Título do Certificado</th>
                  <th className="py-3.5 px-4">Categoria</th>
                  <th className="py-3.5 px-4">Horas</th>
                  <th className="py-3.5 px-4">Data Envio</th>
                  <th className="py-3.5 px-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody ref={listRef} className="divide-y divide-zinc-800/60">
                {isLoading ? (
                  Array.from({length: pageSize}).map((_,i)=>(
                    <tr key={i} className="animate-pulse">
                      <td className="py-4 px-4"><div className="h-4 w-4 bg-zinc-800 rounded"/></td>
                      <td className="py-4 px-4"><div className="h-4 bg-zinc-800 w-32 rounded"/></td>
                      <td className="py-4 px-4"><div className="h-4 bg-zinc-800 w-48 rounded"/></td>
                      <td className="py-4 px-4"><div className="h-4 bg-zinc-800 w-24 rounded"/></td>
                      <td className="py-4 px-4"><div className="h-4 bg-zinc-800 w-12 rounded"/></td>
                      <td className="py-4 px-4"><div className="h-4 bg-zinc-800 w-20 rounded"/></td>
                      <td className="py-4 px-4 text-center"><div className="h-8 w-20 bg-zinc-800 rounded inline-block"/></td>
                    </tr>
                  ))
                ) : (
                  pageSlice.length > 0 ? (
                    pageSlice.map((cert, idx) => {
                      const initials = (cert.studentName || '').split(' ').map(n => n[0]).slice(0, 2).join('');
                      const isFocused = idx === focusedIndex;
                      return (
                        <tr key={cert.id} className={`hover:bg-[#161820] transition-colors ${isFocused? 'bg-[#0f1720]':''}`}>
                          <td className="py-4 px-4">
                            <input type="checkbox" checked={selectedIds.includes(cert.id)} onChange={()=>toggleSelect(cert.id)} aria-label={`Selecionar ${cert.studentName}`} />
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-zinc-300 text-xs">{initials}</div>
                              <div>
                                <button onClick={()=>handleNavigateToStudent(cert.studentRa)} className="font-semibold text-white hover:text-blue-400 text-left transition-colors cursor-pointer">{cert.studentName}</button>
                                <div className="text-[11px] text-zinc-500 font-mono">RA: {cert.studentRa}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 font-semibold text-zinc-200 max-w-xs">
                            <button onClick={()=>handleOpenPreview(cert)} className="hover:text-emerald-400 text-left transition-colors cursor-pointer">{cert.title}</button>
                            <div className="text-[11px] text-zinc-500 font-normal">{cert.issuer}</div>
                          </td>
                          <td className="py-4 px-4 text-zinc-300">{cert.category}</td>
                          <td className="py-4 px-4 font-bold text-zinc-200">{cert.hours}h</td>
                          <td className="py-4 px-4 text-zinc-400">{cert.submissionDate}</td>
                          <td className="py-4 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={()=>setReviewingCertificate(cert)} className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${cert.status === 'PENDENTE' ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-zinc-800 text-zinc-300'}`}><Check className="w-3.5 h-3.5"/> Revisar</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-zinc-500">Nenhum processo encontrado na aba selecionada.</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <PaginationControls page={page} totalPages={totalPages} onPrev={()=>setPage(p=>Math.max(1,p-1))} onNext={()=>setPage(p=>Math.min(totalPages,p+1))} onJump={(n)=>setPage(n)} />
            <div className="text-sm text-zinc-400">Atalhos: j/k navegar • Enter abrir</div>
          </div>
        </section>

        <ConfirmModal open={confirmOpen} title={confirmAction === 'approve' ? 'Confirmar homologação em lote' : 'Confirmar indeferimento em lote'} description={`Você está prestes a ${confirmAction === 'approve' ? 'homologar' : 'indeferir'} ${selectedIds.length} certificados. Essa ação não pode ser revertida sem usar 'Desfazer'.`} onConfirm={doConfirm} onCancel={()=>setConfirmOpen(false)} />

      </main>
    </div>
  );
}
