export function getTextValue(node: Element) {
    return node.textContent?.trim() || '';
}

export function getEveryTextValue(nodes: Array<Element>) {
    return nodes.map(getTextValue);
}

export function getDayNumber(date: Date) {
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1;
    const year = date.getUTCFullYear();
    return year * 10000 + month * 100 + day;
}
