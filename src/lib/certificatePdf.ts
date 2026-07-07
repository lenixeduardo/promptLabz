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
  "https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,500;1,600&display=swap";

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

function dividerHtml(withLines: boolean) {
  const line = `<span style="width:40px;height:1px;background:#2e7d4e;opacity:0.35;"></span>`;
  return `
    <div style="margin-top:18px;display:flex;align-items:center;justify-content:center;gap:8px;">
      ${withLines ? line : ""}
      <span style="width:7px;height:7px;transform:rotate(45deg);background:#2e7d4e;opacity:0.55;"></span>
      ${withLines ? line : ""}
    </div>`;
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
  font-family: 'Poppins', -apple-system, sans-serif; color: #1f2a23;
  overflow: hidden; box-sizing: border-box;
">
  <img src="${frame}" alt="" style="position:absolute;inset:0;width:100%;height:100%;object-fit:fill;pointer-events:none;z-index:1;"/>
  <div style="position:absolute;top:135px;left:110px;right:110px;bottom:150px;display:flex;flex-direction:column;align-items:center;text-align:center;z-index:2;">
    <div style="font-weight:800;font-size:62px;line-height:1.05;letter-spacing:-0.5px;color:#0f3d24;">Certificado</div>
    <div style="margin-top:14px;display:flex;align-items:center;gap:12px;">
      <span style="width:36px;height:1px;background:#2e7d4e;opacity:0.4;"></span>
      <span style="font-weight:600;font-size:24px;color:#2e7d4e;">de Conquista</span>
      <span style="width:36px;height:1px;background:#2e7d4e;opacity:0.4;"></span>
    </div>
    ${dividerHtml(true)}
    <div style="margin-top:36px;font-weight:500;font-size:15px;color:#6b7f72;">Parabéns,</div>
    <div style="margin-top:8px;font-weight:700;font-size:34px;color:#2e7d4e;">${escapeHtml(data.recipient)}</div>
    <div style="margin-top:26px;font-weight:500;font-size:15px;color:#6b7f72;">por concluir com excelência o módulo</div>
    <div style="margin-top:8px;font-weight:700;font-size:22px;color:#0f3d24;max-width:540px;line-height:1.3;">${escapeHtml(data.title)}</div>
    ${dividerHtml(true)}
    <div style="margin-top:30px;display:flex;align-items:center;gap:36px;">
      <div style="text-align:center;">
        <div style="font-size:13px;color:#6b7f72;font-weight:500;">Data de conclusão</div>
        <div style="margin-top:6px;font-weight:700;font-size:18px;color:#0f3d24;">${escapeHtml(data.issuedAt)}</div>
      </div>
      <div style="width:1px;height:36px;background:#2e7d4e;opacity:0.25;"></div>
      <div style="text-align:center;">
        <div style="font-size:13px;color:#6b7f72;font-weight:500;">Carga horária</div>
        <div style="margin-top:6px;font-weight:700;font-size:18px;color:#0f3d24;">${escapeHtml(data.hours)}</div>
      </div>
    </div>
    <img src="${mascot}" alt="" style="margin-top:32px;width:320px;height:auto;object-fit:contain;"/>
    ${dividerHtml(false)}
    <div style="flex:1;"></div>
    <div style="width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;">
      <div style="display:flex;align-items:center;gap:8px;">
        <img src="${qr}" alt="" style="width:56px;height:56px;"/>
        <div style="text-align:left;">
          <div style="font-size:10px;color:#1f2a23;font-weight:700;">Verifique</div>
          <div style="font-size:9px;color:#6b7f72;margin-top:1px;">ID: ${escapeHtml(data.id)}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-weight:800;font-size:22px;line-height:1;">
          <span style="color:#0f3d24;">Prompt</span><span style="font-style:italic;color:#2e7d4e;">Labz</span>
        </div>
        <div style="margin-top:3px;font-size:8px;color:#6b7f72;">Seu laboratório com IA</div>
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
