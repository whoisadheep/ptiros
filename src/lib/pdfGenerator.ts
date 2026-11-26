import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import {
  buildReportPagesFromRecord,
  type AssessmentStudentContext,
  type DossierReportPage,
} from "@/lib/careerAssessment";
import type { StudentCareerTestRecord } from "@/types/database";

// WinAnsi safe text sanitizer (pdf-lib StandardFonts throw on ₹, arrows, emojis, etc.)
export function sanitizePdfText(raw: string): string {
  return String(raw || "")
    .replace(/₹\s*/g, "Rs. ")
    .replace(/[→➔➜]/g, "->")
    .replace(/[←]/g, "<-")
    .replace(/≤/g, "<=")
    .replace(/≥/g, ">=")
    .replace(/±/g, "+/-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/—/g, "--")
    .replace(/–/g, "-")
    .replace(/•/g, "*")
    .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function wrapLines(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const safe = sanitizePdfText(text);
  if (!safe) return [];
  const words = safe.split(" ");
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
      current = candidate;
    } else {
      if (current) lines.push(current);
      if (font.widthOfTextAtSize(word, size) > maxWidth) {
        // Hard split ultra-long token cleanly
        let slice = "";
        for (const ch of word) {
          if (font.widthOfTextAtSize(slice + ch, size) <= maxWidth) {
            slice += ch;
          } else {
            if (slice) lines.push(slice);
            slice = ch;
          }
        }
        current = slice;
      } else {
        current = word;
      }
    }
  }
  if (current) lines.push(current);
  return lines;
}

const COLORS = {
  paperBg: rgb(0.976, 0.965, 0.941), // #F9F6F0 archival cream tint
  cardBg: rgb(0.953, 0.937, 0.898), // #F3EFE5
  white: rgb(1, 1, 1),
  ink: rgb(0.122, 0.106, 0.086), // #1F1B16
  muted: rgb(0.369, 0.333, 0.290), // #5E554A
  subtleBorder: rgb(0.86, 0.83, 0.78),
  terracotta: rgb(0.761, 0.255, 0.047), // #C2410C
  terracottaSoft: rgb(0.996, 0.941, 0.902),
  emerald: rgb(0.082, 0.502, 0.239), // #15803D
  trackBg: rgb(0.90, 0.88, 0.84),
};

export async function generateCareerReportPdfBytes(
  record: StudentCareerTestRecord,
  context: AssessmentStudentContext,
  tier: "free" | "full"
): Promise<Uint8Array> {
  const allPages = buildReportPagesFromRecord(record, context);
  const selectedPages: DossierReportPage[] =
    tier === "full" ? allPages : allPages.filter((p) => p.tier === "free");

  const pdfDoc = await PDFDocument.create();
  pdfDoc.setTitle(
    sanitizePdfText(
      `PTIROS ${tier === "full" ? "Complete 9-Page Career Dossier" : "Free 4-Page Career Snapshot"} - ${record.studentName}`
    )
  );
  pdfDoc.setAuthor("PTIROS Mentorship & Career Diagnostic Lab");
  pdfDoc.setSubject(sanitizePdfText(`${record.topTrackTitle} (${record.matchConfidence}% fit)`));

  const sans = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const sansBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const serifBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const pageWidth = 595.28;
  const pageHeight = 841.89;
  const margin = 46;
  const contentWidth = pageWidth - margin * 2;
  const totalPages = selectedPages.length;

  for (let i = 0; i < selectedPages.length; i++) {
    const spec = selectedPages[i];
    const page: PDFPage = pdfDoc.addPage([pageWidth, pageHeight]);

    // Soft archival background tint
    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: COLORS.paperBg,
    });

    // Top terracotta editorial rule
    page.drawRectangle({
      x: 0,
      y: pageHeight - 10,
      width: pageWidth,
      height: 10,
      color: COLORS.terracotta,
    });

    // Header bar
    let y = pageHeight - 44;
    page.drawText("PTIROS", {
      x: margin,
      y,
      size: 13,
      font: sansBold,
      color: COLORS.ink,
    });
    page.drawText(
      sanitizePdfText(
        tier === "full"
          ? "360-DEGREE CAREER & STREAM DOSSIER"
          : "CAREER MATCH BASIC ANALYSIS"
      ),
      {
        x: margin + 58,
        y: y + 1,
        size: 8.5,
        font: sansBold,
        color: COLORS.terracotta,
      }
    );

    const pageBadge = `PAGE ${i + 1} OF ${totalPages}`;
    const badgeWidth = sansBold.widthOfTextAtSize(pageBadge, 8.5);
    page.drawText(pageBadge, {
      x: pageWidth - margin - badgeWidth,
      y: y + 1,
      size: 8.5,
      font: sansBold,
      color: COLORS.muted,
    });

    y -= 12;
    page.drawLine({
      start: { x: margin, y },
      end: { x: pageWidth - margin, y },
      thickness: 0.75,
      color: COLORS.subtleBorder,
    });

    // Section tag + Title
    y -= 26;
    page.drawText(sanitizePdfText(spec.tag.toUpperCase()), {
      x: margin,
      y,
      size: 8.5,
      font: sansBold,
      color: COLORS.terracotta,
    });

    y -= 24;
    const titleLines = wrapLines(spec.title, serifBold, 20, contentWidth);
    for (const line of titleLines) {
      page.drawText(line, {
        x: margin,
        y,
        size: 20,
        font: serifBold,
        color: COLORS.ink,
      });
      y -= 24;
    }

    const subtitleLines = wrapLines(spec.subtitle, sans, 10.5, contentWidth);
    for (const line of subtitleLines) {
      page.drawText(line, {
        x: margin,
        y,
        size: 10.5,
        font: sans,
        color: COLORS.muted,
      });
      y -= 15;
    }
    y -= 10;

    // Metrics grid (2 columns cleanly drawn)
    if (spec.metrics && spec.metrics.length > 0) {
      const colGap = 12;
      const boxW = (contentWidth - colGap) / 2;
      const rowH = 52;
      for (let mIdx = 0; mIdx < spec.metrics.length; mIdx += 2) {
        const pair = spec.metrics.slice(mIdx, mIdx + 2);
        pair.forEach((metric, cIdx) => {
          const bx = margin + cIdx * (boxW + colGap);
          const by = y - rowH;
          page.drawRectangle({
            x: bx,
            y: by,
            width: boxW,
            height: rowH,
            color: COLORS.white,
            borderColor: COLORS.subtleBorder,
            borderWidth: 0.8,
          });
          page.drawText(sanitizePdfText(metric.label.toUpperCase()), {
            x: bx + 12,
            y: y - 16,
            size: 7.5,
            font: sansBold,
            color: COLORS.muted,
          });
          let valFontSize = 11.5;
          let valLines = wrapLines(metric.value, sansBold, valFontSize, boxW - 24);
          if (valLines.length > 1) {
            valFontSize = 9.5;
            valLines = wrapLines(metric.value, sansBold, valFontSize, boxW - 24);
          }
          valLines.slice(0, 2).forEach((vLine, lIdx) => {
            page.drawText(vLine, {
              x: bx + 12,
              y: y - (valLines.length > 1 ? 28 + lIdx * 11 : 34),
              size: valFontSize,
              font: sansBold,
              color: COLORS.ink,
            });
          });
        });
        y -= rowH + 10;
      }
      y -= 8;
    }

    // Visual Cognitive Bars on Page 1 & Page 2 OR Track Fit Bars on Page 3
    if (i === 0 || i === 1) {
      const dims = record.dimensionScores.slice(0, 5);
      page.drawRectangle({
        x: margin,
        y: y - (dims.length * 28 + 28),
        width: contentWidth,
        height: dims.length * 28 + 28,
        color: COLORS.cardBg,
        borderColor: COLORS.subtleBorder,
        borderWidth: 0.6,
      });
      page.drawText("COGNITIVE & APTITUDE SCORE PROFILE", {
        x: margin + 14,
        y: y - 18,
        size: 8.5,
        font: sansBold,
        color: COLORS.terracotta,
      });
      let barY = y - 36;
      const barMaxW = contentWidth - 28;
      for (const dim of dims) {
        page.drawText(sanitizePdfText(dim.label), {
          x: margin + 14,
          y: barY,
          size: 9.5,
          font: sansBold,
          color: COLORS.ink,
        });
        const pctLabel = `${dim.score}%`;
        const pctW = sansBold.widthOfTextAtSize(pctLabel, 9.5);
        page.drawText(pctLabel, {
          x: margin + 14 + barMaxW - pctW,
          y: barY,
          size: 9.5,
          font: sansBold,
          color: COLORS.terracotta,
        });
        page.drawRectangle({
          x: margin + 14,
          y: barY - 10,
          width: barMaxW,
          height: 5,
          color: COLORS.trackBg,
        });
        page.drawRectangle({
          x: margin + 14,
          y: barY - 10,
          width: Math.max(8, (barMaxW * Math.min(100, dim.score)) / 100),
          height: 5,
          color: dim.score >= 80 ? COLORS.terracotta : COLORS.emerald,
        });
        barY -= 28;
      }
      y -= dims.length * 28 + 42;
    } else if (i === 2) {
      const tracks = record.rankedTracks.slice(0, 6);
      const rowStep = 24;
      const cardHeight = tracks.length * rowStep + 28;
      page.drawRectangle({
        x: margin,
        y: y - cardHeight,
        width: contentWidth,
        height: cardHeight,
        color: COLORS.cardBg,
        borderColor: COLORS.subtleBorder,
        borderWidth: 0.6,
      });
      page.drawText("ALL 6 CAREER TRACKS RANKED FOR YOU", {
        x: margin + 14,
        y: y - 18,
        size: 8.5,
        font: sansBold,
        color: COLORS.terracotta,
      });
      let barY = y - 34;
      const barMaxW = contentWidth - 28;
      for (let tIdx = 0; tIdx < tracks.length; tIdx++) {
        const tr = tracks[tIdx];
        page.drawText(sanitizePdfText(`#${tIdx + 1} ${tr.trackTitle}`), {
          x: margin + 14,
          y: barY,
          size: 9,
          font: sansBold,
          color: COLORS.ink,
        });
        const pctLabel = `${tr.matchPercent}% Fit`;
        const pctW = sansBold.widthOfTextAtSize(pctLabel, 9);
        page.drawText(pctLabel, {
          x: margin + 14 + barMaxW - pctW,
          y: barY,
          size: 9,
          font: sansBold,
          color: tIdx === 0 ? COLORS.terracotta : COLORS.ink,
        });
        page.drawRectangle({
          x: margin + 14,
          y: barY - 9,
          width: barMaxW,
          height: 4.5,
          color: COLORS.trackBg,
        });
        page.drawRectangle({
          x: margin + 14,
          y: barY - 9,
          width: Math.max(8, (barMaxW * Math.min(100, tr.matchPercent)) / 100),
          height: 4.5,
          color: tIdx === 0 ? COLORS.terracotta : COLORS.emerald,
        });
        barY -= rowStep;
      }
      y -= cardHeight + 14;
    }

    // Bullet Insights Section
    page.drawText("KEY DIAGNOSTIC FINDINGS & RECOMMENDATIONS", {
      x: margin,
      y,
      size: 8.5,
      font: sansBold,
      color: COLORS.muted,
    });
    y -= 18;

    for (const bullet of spec.bullets) {
      if (y < 105) break;
      const bulletLines = wrapLines(bullet, sans, 10, contentWidth - 18);
      page.drawRectangle({
        x: margin + 2,
        y: y + 2,
        width: 5,
        height: 5,
        color: COLORS.terracotta,
      });
      for (const bLine of bulletLines) {
        if (y < 84) break;
        page.drawText(bLine, {
          x: margin + 16,
          y,
          size: 10,
          font: sans,
          color: COLORS.ink,
        });
        y -= 14;
      }
      y -= 6;
    }

    // Callout Box at bottom area strictly if it fits without overlapping bullets
    if (spec.callout) {
      const calloutLines = wrapLines(spec.callout.body, sans, 9.5, contentWidth - 28);
      const boxHeight = Math.max(54, 30 + calloutLines.length * 13);
      const boxY = y - boxHeight - 6;
      if (boxY >= 78) {
        page.drawRectangle({
          x: margin,
          y: boxY,
          width: contentWidth,
          height: boxHeight,
          color: COLORS.terracottaSoft,
          borderColor: COLORS.terracotta,
          borderWidth: 0.9,
        });
        page.drawText(sanitizePdfText(spec.callout.title.toUpperCase()), {
          x: margin + 14,
          y: boxY + boxHeight - 17,
          size: 8.5,
          font: sansBold,
          color: COLORS.terracotta,
        });
        let cY = boxY + boxHeight - 32;
        for (const cLine of calloutLines) {
          page.drawText(cLine, {
            x: margin + 14,
            y: cY,
            size: 9.5,
            font: sans,
            color: COLORS.ink,
          });
          cY -= 13;
        }
      }
    }

    // Footer Metadata
    page.drawLine({
      start: { x: margin, y: 54 },
      end: { x: pageWidth - margin, y: 54 },
      thickness: 0.5,
      color: COLORS.subtleBorder,
    });
    const footerRight = sanitizePdfText(
      tier === "full"
        ? "PTIROS Complete 9-Page Career Dossier"
        : "Free Basic Analysis • Full 9-Page Dossier at ptiros.in"
    );
    const fW = sans.widthOfTextAtSize(footerRight, 8);
    const maxFooterLeftW = Math.max(120, contentWidth - fW - 14);
    const footerLeftRaw = sanitizePdfText(
      `PTIROS • ${record.studentName} (${record.grade}) • ${record.id}`
    );
    const footerLeft = wrapLines(footerLeftRaw, sans, 8, maxFooterLeftW)[0] || "PTIROS";
    page.drawText(footerLeft, {
      x: margin,
      y: 38,
      size: 8,
      font: sans,
      color: COLORS.muted,
    });
    page.drawText(footerRight, {
      x: pageWidth - margin - fW,
      y: 38,
      size: 8,
      font: sans,
      color: COLORS.muted,
    });
  }

  return await pdfDoc.save();
}
