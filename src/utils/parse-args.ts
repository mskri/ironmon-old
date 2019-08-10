String.prototype.indexOfRegex = function(regex: RegExp) {
    const match = this.match(regex);
    return match ? this.indexOf(match[0]) : -1;
};

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
    const regex = /\s*(?:([^\s\\\'\"]+)|'((?:[^\'\\]|\\.)*)'|"((?:[^\"\\]|\\.)*)"|(\\.?)|(\S))(\s|$)?/;
    return input
        .split(regex)
        .filter(o => o) // Filter out undefined and nulls
        .filter(o => o.trim().length > 0) // Filter out blanks and spaces
        .slice(1); // Removes the command part from the beginning, e.g. '!add'
};

const commandPartRegex = /^--\w+/;

export const parseArgs = <T>(input: string, defaults: T): T => {
    let args = processargvify(input);
    let props = {};

    for (let i = 0; i < args.length; i++) {
        const current = args[i];
        const next = args[i + 1];
        const argName = removeStartHyphens(current);

        if (next && next.indexOfRegex(commandPartRegex) >= 0) {
            props[argName] = true;
        } else if (current.indexOfRegex(commandPartRegex) >= 0) {
            props[argName] = convertIfApplicable(next);
            i++;
        }
    }

    return Object.assign(defaults, props);
};

export default parseArgs;
