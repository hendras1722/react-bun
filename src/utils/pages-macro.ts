import { readdirSync } from "fs";
import { join } from "path";

/**
 * Ini adalah macro yang berjalan di server-side saat build/transpile.
 * Dia akan memindai folder src/pages dan mengembalikan daftar file.
 */
export function getPages() {
  const pagesDir = join(process.cwd(), "src", "pages");
  const files = readdirSync(pagesDir)
    .filter(f => f.endsWith(".tsx") || f.endsWith(".jsx"))
    .map(f => f.replace(/\.(tsx|jsx)$/, ""));
  
  return files;
}
