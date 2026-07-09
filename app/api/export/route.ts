import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import playwright from "playwright-core";
import chromium from "@sparticuz/chromium-min";

const isDev = process.env.NODE_ENV === "development";

// Helper function to resolve headless browser based on environment
async function getBrowser() {
  if (isDev) {
    try {
      // Local development standard launch
      const browser = await playwright.chromium.launch({
        headless: true,
      });
      return browser;
    } catch (e) {
      // Fallback: search for local installation of Google Chrome on macOS
      const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
      const browser = await playwright.chromium.launch({
        executablePath: chromePath,
        headless: true,
      });
      return browser;
    }
  } else {
    // Production (Vercel Serverless environment using lazy-loaded sparticuz-chromium)
    const executablePath = await chromium.executablePath();
    const browser = await playwright.chromium.launch({
      executablePath,
      args: chromium.args,
      headless: chromium.headless === "true" || chromium.headless === true,
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
              html, body {
                background-color: ${themeBg} !important;
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

    // Launch Playwright with specific page size viewport to prevent scaling distortion
    const { width, height } = getPageViewport(pageSize);
    const browser = await getBrowser();
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
    });
    const page = await context.newPage();

    // Load full HTML and wait until fonts/images resolve
    await page.setContent(fullHtml, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    // Generate the PDF
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

    // Close Playwright browser in the background to prevent waiting delays
    browser.close().catch((err) => console.error("Error closing browser:", err));

    // Return the raw binary response as a downloadable attachment with dynamic name
    return new Response(pdfBuffer, {
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
