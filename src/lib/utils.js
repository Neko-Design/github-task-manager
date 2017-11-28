export class Utils {

    static maskString(plaintext, desiredLength = 12, visibleChars = 5, maskChar = '*') {
        var maskLength = Math.min(plaintext.length - visibleChars, desiredLength);
        return maskChar.repeat(maskLength) + plaintext.slice(-5);
    }

}