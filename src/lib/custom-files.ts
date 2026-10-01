import { createServerFn } from "@tanstack/react-start";

export const getCustomFiles = createServerFn({ method: "GET" })
  .handler(async () => {
    const fs = await import("fs");
    const path = await import("path");
    
    const dir = path.resolve(process.cwd(), "public/custom-programs");
    const indexPath = path.join(dir, "index.json");
    if (!fs.existsSync(indexPath)) {
      return [];
    }
    
    try {
      const indexContent = fs.readFileSync(indexPath, "utf-8");
      const files: string[] = JSON.parse(indexContent);
      
      const fileData = files.map(filename => {
        const filepath = path.join(dir, filename);
        const content = fs.existsSync(filepath) ? fs.readFileSync(filepath, "utf-8") : "";
        return { filename, content };
      });
      return fileData;
    } catch (e) {
      console.error("Failed to read index", e);
      return [];
    }
  });

async function updateIndexJson(dir: string, fs: any, path: any) {
  const files = fs.readdirSync(dir).filter((f: string) => f !== "index.json" && !f.startsWith("."));
  fs.writeFileSync(path.join(dir, "index.json"), JSON.stringify(files));
}

export const addCustomFile = createServerFn({ method: "POST" })
  .validator((payload: { filename: string; content: string }) => payload)
  .handler(async ({ data: { filename, content } }) => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const fs = await import("fs");
    const path = await import("path");
    const execAsync = promisify(exec);
    
    const dir = path.resolve(process.cwd(), "public/custom-programs");
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(dir, filename), content);
    await updateIndexJson(dir, fs, path);
    
    await execAsync("git add .");
    await execAsync(`git commit -m "Add custom program: ${filename}"`);
    await execAsync("git push");
    
    return { success: true };
  });

export const deleteCustomFile = createServerFn({ method: "POST" })
  .validator((filename: string) => filename)
  .handler(async ({ data: filename }) => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const fs = await import("fs");
    const path = await import("path");
    const execAsync = promisify(exec);
    
    const dir = path.resolve(process.cwd(), "public/custom-programs");
    const filepath = path.join(dir, filename);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }
    
    await updateIndexJson(dir, fs, path);
    
    await execAsync("git add .");
    await execAsync(`git commit -m "Delete custom program: ${filename}"`);
    await execAsync("git push");
    
    return { success: true };
  });
