"use client";

import React from 'react';

export default function ConfirmModal({open, title, description, onConfirm, onCancel}:{
  open:boolean,
  title:string,
  description?:string,
  onConfirm:()=>void,
  onCancel:()=>void,
}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-[#0f1113] rounded-2xl p-6 w-full max-w-md border border-zinc-800">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        {description && <p className="text-sm text-zinc-400 mb-4">{description}</p>}
        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="px-4 py-2 bg-transparent border border-zinc-700 rounded">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 bg-emerald-500 text-black rounded">Confirmar</button>
        </div>
      </div>
    </div>
  );
}
