import { readdirSync, writeFileSync, lstatSync, readFileSync } from "fs";
import { join, relative } from "path";

const PAGES_DIR = join(process.cwd(), "src", "pages");
const LAYOUTS_DIR = join(process.cwd(), "src", "layouts");
const ROUTES_OUTPUT = join(process.cwd(), "src", "routes.generated.tsx");
const LAYOUTS_OUTPUT = join(process.cwd(), "src", "layouts.generated.tsx");

function getFilesRecursively(dir: string): string[] {
  let results: string[] = [];
  if (!readdirSync(dir)) return results;
  const list = readdirSync(dir);
  list.forEach(file => {
    const fullPath = join(dir, file);
    const stat = lstatSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(fullPath));
    } else if (fullPath.endsWith(".tsx") || fullPath.endsWith(".jsx")) {
      results.push(fullPath);
    }
  });
  return results;
}

function extractMeta(content: string): string {
  const metaRegex = /export const meta\s*=\s*({[\s\S]*?});?(\n\s*export|\n\s*$)/;
  const match = content.match(metaRegex);
  if (match) {
    return match[1]?.trim() ?? '';
  }

  const singleLineMatch = content.match(/export const meta\s*=\s*({.*?});?/);
  if (singleLineMatch) {
    return singleLineMatch[1]?.trim() ?? '';
  }

  return "undefined";
}

function generate() {
  console.log("🚀 Generating routes & layouts...");

  // 1. Generate Layouts
  const layoutFiles = readdirSync(LAYOUTS_DIR).filter(f => f.endsWith(".tsx"));
  const layoutsData = layoutFiles.map(f => {
    const name = f.replace(/\.tsx$/, "");
    return { name, path: `./layouts/${name}` };
  });

  const layoutsImports = layoutsData.map(l => `import ${l.name} from "${l.path}";`).join("\n");
  const layoutsExport = `export const layouts = {\n  ${layoutsData.map(l => `${l.name}: ${l.name}`).join(",\n  ")}\n};`;

  writeFileSync(LAYOUTS_OUTPUT, `// AUTOMATICALLY GENERATED\nimport React from "react";\n${layoutsImports}\n\n${layoutsExport}\n`);

  // 2. Generate Routes
  const pageFiles = getFilesRecursively(PAGES_DIR);
  const routesData = pageFiles.map(fullPath => {
    const relativePath = relative(PAGES_DIR, fullPath);
    const pathWithoutExt = relativePath.replace(/\.(tsx|jsx)$/, "");
    const content = readFileSync(fullPath, "utf-8");

    // Extract layout (improved to handle quotes better)
    const layoutMatch = content.match(/export const layout\s*=\s*(['"])([^'"]+)\1/);
    let layoutValue = "Main"; // Default
    if (layoutMatch) {
      layoutValue = layoutMatch[2]; // Get the value inside quotes
    } else if (content.includes("export const layout = false")) {
      layoutValue = "false";
    }

    // Extract meta
    const metaValue = extractMeta(content);

    const importName = pathWithoutExt
      .split("/")
      .map(part => {
        const cleanPart = part.replace(/[\[\]\.]/g, "");
        return cleanPart.charAt(0).toUpperCase() + cleanPart.slice(1);
      })
      .join("")
      .replace(/[^a-zA-Z0-9]/g, "");

    let urlPath = pathWithoutExt
      .split("/")
      .map(part => {
        if (part.startsWith("[...") && part.endsWith("]")) return "*";
        if (part.startsWith("[") && part.endsWith("]")) return ":" + part.slice(1, -1);
        return part.toLowerCase();
      })
      .join("/");

    if (urlPath === "index" || urlPath === "home" || urlPath === "page") {
      urlPath = "";
    } else {
      urlPath = urlPath.replace(/\/(index|page|home)$/, "");
    }

    return {
      importName,
      importPath: `./pages/${pathWithoutExt}`,
      urlPath,
      layout: layoutValue,
      meta: metaValue
    };
  });

  // Sort routes
  const sortedRoutes = routesData.sort((a, b) => {
    const aIsStar = a.urlPath.includes("*");
    const bIsStar = b.urlPath.includes("*");
    if (aIsStar && !bIsStar) return 1;
    if (!aIsStar && bIsStar) return -1;
    const aIsDynamic = a.urlPath.includes(":");
    const bIsDynamic = b.urlPath.includes(":");
    if (aIsDynamic && !bIsDynamic) return 1;
    if (!aIsDynamic && bIsDynamic) return -1;
    return b.urlPath.length - a.urlPath.length;
  });

  const routesImports = routesData.map(r => `import ${r.importName} from "${r.importPath}";`).join("\n");
  const routesExport = `export const generatedRoutesRaw = [\n  ${sortedRoutes.map(r =>
    `{ path: "${r.urlPath}", element: <${r.importName} />, layout: ${r.layout === "false" ? "false" : `"${r.layout}"`}, meta: ${r.meta} }`
  ).join(",\n  ")}\n];`;

  writeFileSync(ROUTES_OUTPUT, `// AUTOMATICALLY GENERATED\nimport React from "react";\n${routesImports}\n\n${routesExport}\n`);

  console.log(`✅ Generated ${layoutsData.length} layouts and ${routesData.length} routes.`);
}

generate();
