String.prototype.indexOfRegex = function(regex: RegExp) {
    const match = this.match(regex);
    return match ? this.indexOf(match[0]) : -1;
};

// Converts the value to boolean/number if they can be otherwise returns them as string
const convertIfApplicable = (value: any): string | number | boolean => {
    if (isNaN(value)) {
        const isBooleanTrue = value.toString().toLowerCase() === 'true';
        const isBooleanFalse = value.toString().toLowerCase() === 'false';

        if (isBooleanTrue) return true;
        if (isBooleanFalse) return false;
    } else {
        return Number(value);
    }

    return value;
};

// Removes any number of hyphens from the beginning of string
const removeStartHyphens = (value: string): string => value.replace(/^\-+/g, '');

// Turns string into process.arg like array of arguments
const processargvify = (input: string): string[] => {
    // Adapted from https://github.com/jimmycuadra/shellwords/blob/master/src/shellwords.coffee
    //
    // \s*                       # Leading whitespace
    // (?:                       #
    //     ([^\s\\\'\"]+)        # Normal words
    //     |                     #
    //     '((?:[^\'\\]|\\.)*)'  # Text inside single quotes
    //     |                     #
    //     "((?:[^\"\\]|\\.)*)"  # Text inside double quotes
    //     |                     #
    //     (\\.?)                # Escaped character
    //     |                     #
    //     (\S)                  # Garbage
    // )                         #
    // (\s|$)?
    const regExp = /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/;
    return input
        .split(regExp)
        .filter(o => o) // Filter out undefined and nulls
        .filter(o => o.trim().length > 0) // Filter out blanks and spaces
        .slice(1); // Removes the command part from the beginning, e.g. '!add'
};

export const parseArgs = <T>(input: string, defaults: T): T => {
    const argKeyRegExp = /^--\w+/;
    let args = processargvify(input.trim());
    let props = {};

    for (let i = 0; i < args.length; i++) {
        const current = args[i];
        const next = args[i + 1];
        const argName = removeStartHyphens(current);

        if ((next && next.indexOfRegex(argKeyRegExp) >= 0) || !next) {
            // If next is already a new argKey then current argKey value is boolean
            // also if next one is null while current is argKey it means that current
            // argKey is boolean because we are at the end of the string
            props[argName] = true;
        } else if (next && current.indexOfRegex(argKeyRegExp) >= 0) {
            props[argName] = convertIfApplicable(next);
            i++;
        }
    }

    return Object.assign(defaults, props);
};

export const getMissingKeys = (requiredKeys: string[], args: object = {}): string[] => {
    let missingKeys: string[] = [];

    requiredKeys.forEach((key: string) => {
        if (!args.hasOwnProperty(key)) missingKeys.push(key);
    });

    return missingKeys;
};

export default parseArgs;
