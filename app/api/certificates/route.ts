import { NextResponse } from 'next/server';
import { INITIAL_CERTIFICATES } from '../../data/mockData';
import { Certificate } from '../../types';

// In-memory server backup store
let globalCertificatesServerStore: Certificate[] = [...INITIAL_CERTIFICATES];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: globalCertificatesServerStore,
    total: globalCertificatesServerStore.length,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (Array.isArray(body)) {
      globalCertificatesServerStore = body;
      return NextResponse.json({
        success: true,
        message: 'Lista de certificados sincronizada com sucesso.',
        count: globalCertificatesServerStore.length,
      });
    }

    if (!body.title || !body.issuer || !body.hoursRequested) {
      return NextResponse.json(
        { success: false, error: 'Dados obrigatórios ausentes (title, issuer, hoursRequested).' },
        { status: 400 }
      );
    }

    const newCert: Certificate = {
      ...body,
      id: body.id || `cert-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: body.status || 'draft',
      verificationCode: body.verificationCode || `UFSCAR-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    };

    globalCertificatesServerStore.unshift(newCert);

    return NextResponse.json({
      success: true,
      data: newCert,
      message: 'Certificado cadastrado no servidor de simulação com sucesso.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Falha ao processar requisição: ' + error.message },
      { status: 500 }
    );
  }
}
