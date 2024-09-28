export default async function (url) {
    const response = await fetch(url);
    const data = await response.arrayBuffer();
    const blob = new Blob([data],{ type: 'application/pdf' });
    return URL.createObjectURL(blob);
}