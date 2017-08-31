interface ISelection {
    start: number;
    end: number;
}

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
        this.input.addEventListener('keydown', this.onKeydown.bind(this));
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

    private getSelection(): ISelection {
        return {start: this.input.selectionStart, end: this.input.selectionEnd};
    }

    // Events

    protected onKeydown(event: KeyboardEvent) {
        // Backspace
        if (event.which === 8) {
            let pos = this.getCaret(),
                selection: ISelection = this.getSelection();

            if (selection.start !== selection.end) {
                for (let i = selection.start; i < selection.end; i++) {
                    this.currValue[i] = undefined;
                }
            } else {
                this.currValue[pos - 1] = undefined;
                pos = pos - 1;
            }

            this.updateInput(pos);
            this.setCaret(pos);

            event.preventDefault();
        }
    }

    protected onKeypress(event: KeyboardEvent) {
        let pos = this.getCaret(),
            selection: ISelection = this.getSelection();

        if (selection.start !== selection.end) {
            for (let i = selection.start; i < selection.end; i++) {
                this.currValue[i] = undefined;
            }
        } else {
            this.currValue[pos] = undefined;
        }

        if (this.mask[pos]) {
            if (typeof this.mask[pos] === 'string') {
                this.currValue[pos] = <string>this.mask[pos];
                this.setCaret(pos+1);
                this.onKeypress(event);
            } else {
                if ((<RegExp>this.mask[pos]).test(event.key)) {
                    this.currValue[pos] = event.key;
                    this.updateInput(pos);
                }
            }
        }

        if (bypassKeys.indexOf(event.which) === -1) {
            event.preventDefault();
        } else {
            this.updateInput(pos);
        }


    }

    protected onFocus(event: Event) {
        this.updateInput();
    }


}

export = TSMask;