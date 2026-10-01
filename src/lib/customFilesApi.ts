import { createServerFn } from "@tanstack/react-start";

// List all files in the custom-files directory
export const getCustomFiles = createServerFn({ method: "GET" }).handler(async () => {
  const fs = await import("fs");
  const path = await import("path");
  const dirPath = path.resolve(process.cwd(), "src/custom-files");

  if (!fs.existsSync(dirPath)) {
    return [];
  }

  const files = fs.readdirSync(dirPath);
  const result = [];
  
  for (const file of files) {
    const stat = fs.statSync(path.join(dirPath, file));
    if (stat.isFile()) {
      const content = fs.readFileSync(path.join(dirPath, file), "utf-8");
      result.push({ name: file, content });
    }
  }

  return result;
});

// Add or update a file
export const saveCustomFile = createServerFn({ method: "POST" })
  .validator((payload: { filename: string; content: string }) => payload)
  .handler(async ({ data: { filename, content } }) => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const fs = await import("fs");
    const path = await import("path");
    const execAsync = promisify(exec);

    const dirPath = path.resolve(process.cwd(), "src/custom-files");
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    const filePath = path.join(dirPath, filename);
    fs.writeFileSync(filePath, content, "utf-8");

    // Run git commands
    await execAsync("git add .");
    await execAsync(`git commit -m "Auto update custom file: ${filename}"`);
    await execAsync("git push");

    return { success: true };
  });

// Delete a file
export const deleteCustomFile = createServerFn({ method: "POST" })
  .validator((payload: { filename: string }) => payload)
  .handler(async ({ data: { filename } }) => {
    const { exec } = await import("child_process");
    const { promisify } = await import("util");
    const fs = await import("fs");
    const path = await import("path");
    const execAsync = promisify(exec);

    const dirPath = path.resolve(process.cwd(), "src/custom-files");
    const filePath = path.join(dirPath, filename);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      
      // Run git commands
      await execAsync("git add .");
      await execAsync(`git commit -m "Auto delete custom file: ${filename}"`);
      await execAsync("git push");
    }

    return { success: true };
  });
