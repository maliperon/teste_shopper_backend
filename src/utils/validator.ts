export default function isValidBase64(data: string): boolean {
    const base64Pattern = /^data:image\/(jpeg|png);base64,/;

    if (!base64Pattern.test(data)) {
        return false;
    }

    const base64Data = data.replace(base64Pattern, '');
    const base64ContentPattern = /^[a-zA-Z0-9+/=]+$/;

    return base64ContentPattern.test(base64Data);
}
