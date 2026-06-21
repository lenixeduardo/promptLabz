import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QRCode from "qrcode";
import frameUrl from "@/assets/certificate-frame.png";
import mascotUrl from "@/assets/certificate-mascot-laurels.png";

interface CertificateData {
  recipient: string;
  title: string;
  issuedAt: string;
  hours: string;
  id: string;
}

interface CertificateDownload {
  filename: string;
  url: string;
}

function filenameFor(data: CertificateData) {
  const slug = data.title
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `certificado-${slug || data.id}.pdf`;
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,400;1,500&family=Inter:wght@400;500;600;700;800&family=Dancing+Script:wght@600;700&display=swap";

let fontsPromise: Promise<void> | null = null;
function ensureFontsLoaded(): Promise<void> {
  if (fontsPromise) return fontsPromise;
  fontsPromise = new Promise((resolve) => {
    if (typeof document === "undefined") return resolve();
    const existing = document.querySelector(`link[data-cert-fonts]`);
    if (!existing) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = FONTS_HREF;
      link.setAttribute("data-cert-fonts", "1");
      document.head.appendChild(link);
    }
    const ready = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts?.ready;
    if (ready) {
      ready.then(() => resolve()).catch(() => resolve());
    } else {
      setTimeout(resolve, 600);
    }
  });
  return fontsPromise;
}

export function buildCertificateHtml(
  data: CertificateData,
  frame: string,
  mascot: string,
  qr: string,
) {
  return `
<div style="
  width: 800px; height: 1131px; position: relative; background: #ffffff;
  font-family: 'Inter', -apple-system, sans-serif; color: #1f2a23;
  overflow: hidden; box-sizing: border-box;
">
  <img src="${frame}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;z-index:1;"/>
  <div style="position:absolute;top:110px;left:90px;right:90px;bottom:130px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:2;">
    <div style="display:flex;align-items:center;gap:8px;">
      <div style="width:30px;height:30px;border-radius:7px;background:#0f3d24;color:#ffffff;font-weight:800;font-size:12px;display:flex;align-items:center;justify-content:center;">AI</div>
      <div style="font-weight:700;font-size:22px;color:#0f3d24;">PromptLabz</div>
    </div>
    <div style="margin-top:45px;font-family:'Playfair Display',Georgia,serif;font-weight:700;font-size:64px;line-height:1;color:#0f3d24;">Certificado</div>
    <div style="margin-top:4px;font-family:'Playfair Display',Georgia,serif;font-weight:500;font-style:italic;font-size:26px;color:#2e7d4e;">de Conquista</div>
    <div style="margin-top:28px;font-weight:500;font-size:15px;color:#6b7f72;">Parabéns,</div>
    <div style="margin-top:8px;font-weight:700;font-size:30px;color:#2e7d4e;">${escapeHtml(data.recipient)}</div>
    <div style="margin-top:16px;font-weight:500;font-size:14px;color:#6b7f72;">por concluir com excelência o módulo</div>
    <div style="margin-top:8px;font-weight:700;font-size:20px;color:#0f3d24;max-width:520px;line-height:1.25;">${escapeHtml(data.title)}</div>
    <div style="margin-top:22px;display:flex;align-items:center;gap:8px;">
      <span style="width:40px;height:1px;background:#2e7d4e;opacity:0.4;"></span>
      <span style="width:6px;height:6px;border-radius:50%;border:1px solid #2e7d4e;opacity:0.6;"></span>
      <span style="width:40px;height:1px;background:#2e7d4e;opacity:0.4;"></span>
    </div>
    <div style="margin-top:18px;display:flex;gap:90px;">
      <div style="text-align:center;">
        <div style="font-size:12px;color:#6b7f72;font-weight:500;">Data de conclusão</div>
        <div style="margin-top:4px;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:17px;color:#0f3d24;">${escapeHtml(data.issuedAt)}</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:12px;color:#6b7f72;font-weight:500;">Carga horária</div>
        <div style="margin-top:4px;font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:17px;color:#0f3d24;">${escapeHtml(data.hours)}</div>
      </div>
    </div>
    <img src="${mascot}" alt="" style="margin-top:18px;width:290px;height:auto;object-fit:contain;"/>
    <div style="flex:1;"></div>
    <div style="width:100%;display:flex;align-items:flex-end;justify-content:space-between;padding:0 6px;">
      <div style="display:flex;align-items:center;gap:10px;">
        <img src="${qr}" alt="" style="width:64px;height:64px;"/>
        <div style="text-align:left;">
          <div style="font-size:11px;color:#1f2a23;font-weight:600;">Verifique a autenticidade</div>
          <div style="font-size:10px;color:#6b7f72;margin-top:2px;">ID: ${escapeHtml(data.id)}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-family:'Dancing Script','Brush Script MT',cursive;font-weight:700;font-size:38px;color:#0f3d24;line-height:1;">PromptLabz</div>
        <div style="margin-top:2px;width:170px;margin-left:auto;border-top:1px solid #2e7d4e;opacity:0.5;"></div>
        <div style="margin-top:4px;font-weight:700;font-size:12px;color:#0f3d24;">PromptLabz</div>
        <div style="font-size:10px;color:#6b7f72;margin-top:1px;">Seu laboratório de ideias com IA</div>
      </div>
    </div>
  </div>
</div>`.trim();
}

export async function createCertificatePdfBlob(data: CertificateData): Promise<Blob> {
  const [, frameImg, mascotImg, qrDataUrl] = await Promise.all([
    ensureFontsLoaded(),
    loadImage(frameUrl),
    loadImage(mascotUrl),
    QRCode.toDataURL(
      `https://promptlabz.app/verify/${encodeURIComponent(data.id)}`,
      { margin: 0, color: { dark: "#0f3d24", light: "#ffffff" } },
    ),
  ]);

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.zIndex = "-1";
  host.style.pointerEvents = "none";
  host.innerHTML = buildCertificateHtml(data, frameImg.src, mascotImg.src, qrDataUrl);
  document.body.appendChild(host);

  try {
    const node = host.firstElementChild as HTMLElement;
    const canvas = await html2canvas(node, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const imgRatio = canvas.width / canvas.height;
    const pageRatio = pageW / pageH;
    let drawW = pageW;
    let drawH = pageH;
    if (imgRatio > pageRatio) {
      drawH = pageW / imgRatio;
    } else {
      drawW = pageH * imgRatio;
    }
    const offsetX = (pageW - drawW) / 2;
    const offsetY = (pageH - drawH) / 2;
    pdf.addImage(canvas.toDataURL("image/jpeg", 0.95), "JPEG", offsetX, offsetY, drawW, drawH);
    return pdf.output("blob");
  } finally {
    host.remove();
  }
}

export async function downloadCertificatePdf(data: CertificateData): Promise<CertificateDownload> {
  const filename = filenameFor(data);
  const blob = await createCertificatePdfBlob(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  return { filename, url };
}
