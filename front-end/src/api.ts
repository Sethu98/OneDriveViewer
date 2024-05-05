export async function getAllFiles() {
    const resp = await fetch('/get_all_files');
    return resp.json();
}

export const apis = {
    getAllFiles
}