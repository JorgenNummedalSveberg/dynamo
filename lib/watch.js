// const chokidar = require("chokidar");
// const fs = require("fs");
// const path = require("path");
// const { compileHtmlToJs } = require("./build");
import chokidar from "chokidar";
import path from "path";
import { fileURLToPath } from "url";
import { compileHtmlToJs, debounce } from "./build.js";

// Directory to watch
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace("lib", "");
const directoryPath = path.join(__dirname, "src");

// Watch for changes in HTML files
chokidar
  .watch(directoryPath, { persistent: true })
  .on("change", debounce(compileHtmlToJs))
  .on("add", debounce(compileHtmlToJs))
  .on("unlink", debounce(compileHtmlToJs));

console.log(`Watching for changes in ${directoryPath}...`);
