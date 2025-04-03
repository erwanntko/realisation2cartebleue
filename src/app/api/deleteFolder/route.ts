import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
    const { folderPath } = await req.json();
    const fullPath = path.join(process.cwd(), folderPath);
    fs.rmSync(fullPath, { recursive: true, force: true });
}