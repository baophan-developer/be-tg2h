export default function createCodeOrder(count: number) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(2, 4);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const A = characters[Math.floor(Math.random() * characters.length)];
    const B = characters[Math.floor(Math.random() * characters.length)];
    const C = characters[Math.floor(Math.random() * characters.length)];

    return `${year}${month}${day}${A}${B}${C}${count}`;
}
