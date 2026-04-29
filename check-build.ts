const clientBuild = await Bun.build({
  entrypoints: ["./src/frontend.tsx"],
  target: "browser",
});
console.log(clientBuild.outputs.map(o => o.path));
