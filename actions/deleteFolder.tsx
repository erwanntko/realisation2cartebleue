export default async function deleteFolder(folderPath: string) {
    await fetch('http://localhost:3000/api/deleteFolder', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ folderPath }),
    });
}