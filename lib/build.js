import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename).replace("lib", "");

// Directory to watch
const directoryPath = path.join(__dirname, "src/html");
// Output JavaScript file
const outputFilePath = path.join(__dirname, "build/htmlContent.js");
if (!fs.existsSync(path.join(__dirname, "build"))) {
  fs.mkdirSync(path.join(__dirname, "build"));
}

let timeout;
export const debounce = (fn) => {
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fn(...args);
    }, 100);
  };
};

// Function to read all HTML files and compile them into a JS file
export const compileHtmlToJs = () => {
  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      return console.log("Unable to scan directory: " + err);
    }

    let outputContent = "";
    let elements = [];
    files.forEach((file) => {
      if (path.extname(file) === ".html") {
        if (elements.includes(path.basename(file, ".html"))) return;
        elements.push(path.basename(file, ".html"));
        outputContent += `const ${path.basename(file, ".html")} = {};\n`;
      } else if (path.extname(file) === ".css") {
        if (elements.includes(path.basename(file, ".css"))) return;
        elements.push(path.basename(file, ".css"));
        outputContent += `const ${path.basename(file, ".css")} = {};\n`;
      }
    });

    files.forEach((file) => {
      if (path.extname(file) === ".html") {
        const filePath = path.join(directoryPath, file);
        const variableName = path.basename(file, ".html");
        const fileContent = fs.readFileSync(filePath, "utf8");
        const escapedContent = fileContent.replace(/`/g, "\\`");

        outputContent += `${variableName}.component = \`\n${escapedContent}\`;\n\n`;
      }
    });

    files.forEach((file) => {
      if (path.extname(file) === ".css") {
        const filePath = path.join(directoryPath, file);
        const variableName = path.basename(file, ".css");
        const fileContent = fs.readFileSync(filePath, "utf8");
        const escapedContent = fileContent.replace(/`/g, "\\`");

        outputContent += `${variableName}.style = \`\n${escapedContent}\`;\n\n`;
      }
    });

    outputContent += "const components = { ";
    files.forEach((file) => {
      if (path.extname(file) === ".html") {
        const variableName = path.basename(file, ".html");
        outputContent += `${variableName}: ${variableName}, `;
      }
    });
    outputContent += "};";

    fs.writeFileSync(outputFilePath, outputContent);
    console.log("HTML content compiled to JS file successfully.");
  });

  fs.copyFileSync(
    path.join(__dirname, "src/index.html"),
    path.join(__dirname, "build/index.html")
  );
  fs.copyFileSync(
    path.join(__dirname, "lib/main.js"),
    path.join(__dirname, "build/main.js")
  );
  fs.copyFileSync(
    path.join(__dirname, "src/style.css"),
    path.join(__dirname, "build/style.css")
  );
};

debounce(compileHtmlToJs)();
