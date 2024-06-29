export function getCookie(name: string): string {
    return document.cookie.replace(
        new RegExp("(?:^|.*;\\s*)" + name + "\\s*=\\s*([^;]*).*$|^.*$"), "$1"
    );
}

export function setCookie(name: string, value: string): void {
    document.cookie = `${name}=${value}; Domain=ai.michelfinley.de; Path=/; SameSite=Strict`;
    return;
}
