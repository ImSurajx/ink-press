import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium-min";

const isDev = process.env.NODE_ENV === "development";

// Helper function to resolve headless browser based on environment using puppeteer-core
async function getBrowser() {
  if (isDev) {
    try {
      // Local development standard launch
      const browser = await puppeteer.launch({
        headless: true,
      });
      return browser;
    } catch (e) {
      // Fallback: search for local installation of Google Chrome on macOS
      const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: true,
      });
      return browser;
    }
  } else {
    // Production (Vercel Serverless environment using lazy-loaded sparticuz-chromium from CDN)
    const executablePath = await chromium.executablePath(
      "https://github.com/Sparticuz/chromium/releases/download/v149.0.0/chromium-v149.0.0-pack.x64.tar"
    );
    const browser = await puppeteer.launch({
      executablePath,
      args: chromium.args,
      headless: (chromium as any).headless === "true" || (chromium as any).headless === true,
      defaultViewport: (chromium as any).defaultViewport,
    });
    return browser;
  }
}

function getPageViewport(pageSize: string) {
  const dimensions: Record<string, { width: number; height: number }> = {
    A4: { width: 794, height: 1123 },      // Standard A4 at 96 DPI
    Letter: { width: 816, height: 1056 },  // Standard Letter at 96 DPI
    Legal: { width: 816, height: 1344 },   // Standard Legal at 96 DPI
    A3: { width: 1123, height: 1587 },     // Standard A3 at 96 DPI
    A5: { width: 559, height: 794 },       // Standard A5 at 96 DPI
  };
  return dimensions[pageSize] || dimensions.A4;
}

export async function POST(req: NextRequest) {
  try {
    let html = "";
    let theme = "";
    let customCSS = "";
    let pageSize = "A4";
    let downloadName = "ink-press-document.pdf";

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await req.json();
      html = body.html;
      theme = body.theme;
      customCSS = body.customCSS;
      pageSize = body.pageSize || "A4";
      downloadName = body.downloadName || "ink-press-document.pdf";
    } else {
      // Parse form data from form-url-encoded or multipart submissions
      const formData = await req.formData();
      html = formData.get("html") as string || "";
      theme = formData.get("theme") as string || "";
      customCSS = formData.get("customCSS") as string || "";
      pageSize = formData.get("pageSize") as string || "A4";
      downloadName = formData.get("downloadName") as string || "ink-press-document.pdf";
    }

    if (!html) {
      return NextResponse.json({ error: "No HTML content provided" }, { status: 400 });
    }

    // Read base and theme stylesheet rules from the filesystem
    let themeCSS = "";
    if (theme && theme !== "custom") {
      const themePath = path.join(process.cwd(), "styles", `${theme}.css`);
      if (fs.existsSync(themePath)) {
        themeCSS = fs.readFileSync(themePath, "utf-8");
      }
    }

    const markdownCSSPath = path.join(process.cwd(), "styles", "markdown.css");
    const markdownCSS = fs.existsSync(markdownCSSPath)
      ? fs.readFileSync(markdownCSSPath, "utf-8")
      : "";

    // Extract active background color from theme CSS to apply to document canvas elements dynamically
    const bgMatch = themeCSS.match(/--theme-background:\s*([^;]+)/);
    const themeBg = bgMatch ? bgMatch[1].trim() : "#ffffff";

    // Construct the printable HTML page
    const fullHtml = `
      <!DOCTYPE html>
      <html class="theme-${theme || "github"}">
        <head>
          <meta charset="utf-8" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=STIX+Two+Text:ital,wght@0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300&family=Outfit:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" rel="stylesheet" />
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" />
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: transparent;
            }
            ${markdownCSS}
            ${themeCSS}
            ${customCSS || ""}

            @media print {
              @page {
                margin-top: 1cm !important;
                margin-bottom: 1cm !important;
                margin-left: 0mm !important;
                margin-right: 0mm !important;
                background-color: ${themeBg} !important;
              }
              html, body {
                background-color: transparent !important;
              }
            }
          </style>
        </head>
        <body class="theme-${theme || "github"}">
          <div class="markdown-body theme-${theme || "github"}">
            ${html}
          </div>
        </body>
      </html>
    `;

    // Launch Puppeteer with specific page size viewport to prevent scaling distortion
    const { width, height } = getPageViewport(pageSize);
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });

    // Load full HTML and wait until fonts/images resolve
    await page.setContent(fullHtml, { waitUntil: "networkidle0" as any });
    await page.evaluate(() => document.fonts.ready);

    // Run pagination calculation server-side inside Puppeteer to guarantee clean breaks
    await page.evaluate((targetPageHeight) => {
      const container = document.getElementById("ink-preview-container") || document.querySelector(".markdown-body");
      if (!container) return;

      const children = Array.from(container.children);
      if (children.length === 0) return;

      let currentHeight = 0;

      // Temporarily strip auto-page-break to measure natural margins & heights accurately
      children.forEach((child: any) => {
        child.classList.remove("auto-page-break");
        if (child.tagName === "UL" || child.tagName === "OL") {
          Array.from(child.children).forEach((li: any) => {
            li.classList.remove("auto-page-break");
          });
        }
      });

      children.forEach((child: any) => {
        if (child.tagName === "STYLE" || child.style.display === "none") return;

        if (child.classList.contains("page-break-before")) {
          child.classList.add("auto-page-break");
          currentHeight = 0;
          return;
        }

        if (child.tagName === "UL" || child.tagName === "OL") {
          const lis = Array.from(child.children);
          const listStyles = window.getComputedStyle(child);
          const listMarginTop = parseFloat(listStyles.marginTop) || 0;
          const listMarginBottom = parseFloat(listStyles.marginBottom) || 0;

          currentHeight += listMarginTop;

          lis.forEach((li: any) => {
            const h = li.offsetHeight;
            const styles = window.getComputedStyle(li);
            const marginTop = parseFloat(styles.marginTop) || 0;
            const marginBottom = parseFloat(styles.marginBottom) || 0;
            const totalHeight = h + marginTop + marginBottom;

            if (currentHeight + totalHeight > targetPageHeight) {
              if (currentHeight > 0) {
                li.classList.add("auto-page-break");
              }
              currentHeight = totalHeight % targetPageHeight;
            } else {
              currentHeight += totalHeight;
            }
          });

          currentHeight += listMarginBottom;
          return;
        }

        const h = child.offsetHeight;
        const styles = window.getComputedStyle(child);
        const marginTop = parseFloat(styles.marginTop) || 0;
        const marginBottom = parseFloat(styles.marginBottom) || 0;
        const totalHeight = h + marginTop + marginBottom;

        if (currentHeight + totalHeight > targetPageHeight) {
          if (currentHeight > 0) {
            child.classList.add("auto-page-break");
          }
          currentHeight = totalHeight % targetPageHeight;
        } else {
          currentHeight += totalHeight;
        }
      });
    }, height - 76);

    // Generate the PDF using Puppeteer
    const pdfBuffer = await page.pdf({
      format: pageSize as any,
      printBackground: true,
      margin: {
        top: "0px",
        bottom: "0px",
        left: "0px",
        right: "0px",
      },
    });

    // Close browser in the background to prevent waiting delays
    await browser.close();

    // Return the raw binary response as a downloadable attachment with dynamic name
    return new Response(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${downloadName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });

  } catch (error: any) {
    console.error("PDF Export API error:", error);
    return NextResponse.json(
      { error: `PDF generation failed: ${error.message || error}` },
      { status: 500 }
    );
  }
}
