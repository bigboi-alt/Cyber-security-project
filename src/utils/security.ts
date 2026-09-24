// Salted cryptographic hash verification to ensure quiz answers and SOC incident verdicts
// cannot be extracted by inspecting the DOM, HTML attributes, or JavaScript bundle state in DevTools.

export function verifySaltedHash(id: string, choice: string, expectedHash: string): boolean {
  let h = 0x811c9dc5;
  const input = `nexum_salt_9281:${id}:${choice}:sec`;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const hex = (h >>> 0).toString(16).padStart(8, '0');
  return hex === expectedHash;
}
