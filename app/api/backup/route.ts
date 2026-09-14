import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { success: false, error: 'Formato de arquivo JSON inválido ou corrompido.' },
        { status: 400 }
      );
    }

    if (!body.certificates || !Array.isArray(body.certificates)) {
      return NextResponse.json(
        { success: false, error: 'O arquivo de backup não contém uma lista válida de certificados ("certificates").' },
        { status: 422 }
      );
    }

    return NextResponse.json({
      success: true,
      valid: true,
      countCertificates: body.certificates.length,
      exportedAt: body.exportedAt || new Date().toISOString(),
      message: 'Arquivo de backup validado com sucesso.',
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'O arquivo enviado não é um JSON válido.' },
      { status: 400 }
    );
  }
}
