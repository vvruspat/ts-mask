const bypassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];

class TSMask {

    protected input: HTMLInputElement;
    protected mask: (RegExp | string)[];
    
    protected prevValue: string[] = [];
    protected currValue: string[] = [];

    constructor(input: HTMLInputElement, mask: (RegExp | string)[]) {

        if (input && mask) {
            this.mask = mask;
            this.input = input;
            this.bindEvents();
        }

    }

    protected bindEvents() {
        this.input.addEventListener('keypress', this.onKeypress.bind(this));
        this.input.addEventListener('focus', this.onFocus.bind(this));
    }

    protected getCaret() {
        try {
            let cSelStart = this.input.selectionStart.toString();

            return parseInt(cSelStart);
        } catch (e) {}
    }

    protected setCaret(pos: number) {
        try {
            if (this.input.setSelectionRange) {
                this.input.setSelectionRange(pos, pos);
            }
        } catch (e) {}
    }

    protected updateInput(pos?: number) {
        let maskString = '',
            firstPos = pos || 0;

        this.mask.forEach((pattern: string | RegExp, index: number) => {
            if (typeof pattern === 'object') {
                maskString += this.currValue[index] ? this.currValue[index] : '_';
                if (!firstPos) {
                    firstPos = index;
                }
            } else {
                maskString += pattern;
            }
        });

        this.input.value = maskString;

        if (!pos) {
            setTimeout(() => {
                this.setCaret(firstPos);
            }, 50);
        } else {
            this.setCaret(firstPos + 1);
        }

    }

    // Events

    protected onKeypress(event: KeyboardEvent) {
        let pos = this.getCaret();

        if (bypassKeys.indexOf(parseInt(event.code)) === -1) {
            event.preventDefault();
        }

        if (this.mask[pos]) {
            if (typeof this.mask[pos] === 'string') {
                this.currValue[pos] = <string>this.mask[pos];
                this.setCaret(pos+1);
                this.onKeypress(event);
            } else {
                if ((<RegExp>this.mask[pos]).test(event.key)) {
                    this.prevValue = this.currValue;
                    this.currValue[pos] = event.key;
                    this.updateInput(pos);
                }
            }
        } else {
            this.currValue = this.prevValue;
            this.updateInput();
        }


    }

    protected onFocus(event: Event) {
        this.updateInput();
    }


}

export = TSMask;