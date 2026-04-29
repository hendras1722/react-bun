const pages = import.meta.glob("./src/pages/*.tsx");
console.log("Pages found:", Object.keys(pages));
