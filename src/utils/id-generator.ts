export class IdGenerator {
  static generateSimpleId(items: any[]): string {
    if (items.length === 0) {
      return "1";
    }

    const max = Math.max(...items.map(item => parseInt(item.id)));
    return (max + 1).toString();
  }

  static generatePrefixedId(items: any[], prefix: string, padLength: number = 3): string {
    if (items.length === 0) {
      return prefix + "1".padStart(padLength, "0");
    }

    const max = Math.max(...items.map(item => parseInt(item.id.replace(prefix, ""))));
    const nextNumber = max + 1;
    return prefix + nextNumber.toString().padStart(padLength, "0");
  }

  static generateStaffId(items: any[], prefix: string = "S", padLength: number = 3): string {
    if (items.length === 0) {
      return prefix + "1".padStart(padLength, "0");
    }

    const max = Math.max(...items.map(item => parseInt(item.staffId.replace(prefix, ""))));
    const nextNumber = max + 1;
    return prefix + nextNumber.toString().padStart(padLength, "0");
  }
}
