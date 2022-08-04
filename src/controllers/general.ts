

export function inRange(offset: number, limit: number, total: number) {
    if (offset + limit > total) {
        return total;
    } else {
        return offset + limit;
    }
}

export function showing(offset: number, limit: number, total: number) {
    if (offset + limit > total) {
        return total - offset;
    } else {
        return limit;
    }
}