/// <reference path="Sort.ts" /> 


class SortManager<T extends Sort> {

    private sort: T;

    private nextBtn: HTMLButtonElement;

    private autoBtn: HTMLButtonElement;

    private resetBtn: HTMLButtonElement;

    private counterBtns: NodeListOf<HTMLElement>;

    private dataNumTxt: HTMLInputElement;

    private speedRadios: NodeListOf<HTMLElement>;

    // TODO
    private SESSION_SORT_DATA_NUM = 'sort-data-num';

    private SESSION_SORT_AUTO_SPEED = 'sort-auto-speed';

    constructor(sort: T) {

        // セッションストレージからデータ取得
        var sessionDataNum = window.sessionStorage.getItem(this.SESSION_SORT_DATA_NUM);
        if (!sessionDataNum) {
            sessionDataNum = '10';
        }

        this.sort = sort;
        this.sort.setCallbackAutoFinished(() => {
            this.switchAutoMode(false);
        });
        this.sort.init(Number(sessionDataNum));

        // HTMLエレメント取得
        //===============

        this.nextBtn = <HTMLInputElement>document.getElementById('next-btn');
        this.autoBtn = <HTMLButtonElement>document.getElementById('auto');
        this.resetBtn = <HTMLButtonElement>document.getElementById('reset');
        this.counterBtns = document.getElementsByName('counterBtn');
        this.dataNumTxt = <HTMLInputElement>document.getElementById('data-num');
        this.speedRadios = document.getElementsByName('speed');

        // HTMLエレメント初期化
        //===============

        this.dataNumTxt.value = sessionDataNum;

        // オートスピード

        var sessionAutoSpeed = window.sessionStorage.getItem(this.SESSION_SORT_AUTO_SPEED);
        if (!sessionAutoSpeed) {
            sessionAutoSpeed = '1';
        }

        for (var speedRadio of <any>this.speedRadios) {

            var radio = <HTMLInputElement>speedRadio;

            if (radio.value == sessionAutoSpeed) {
                radio.checked = true;
                speedRadio.parentElement.classList.add('active');
                this.sort.setSpeed(Number(radio.value));
            }
        }


        // イベント登録
        //===============

        // Next
        this.nextBtn.addEventListener('click', () => {
            if (!this.sort.isAuto) {
                return;
            } else {
                this.sort.update();
            }
        });

        // Auto
        this.autoBtn.addEventListener('click', (event: HTMLElementEvent<HTMLButtonElement>) => {
            var value = event.target.value;
            this.switchAutoMode(value == 'on');
        });

        // Reset
        this.resetBtn.addEventListener('click', () => {
            this.sort.reset(Number(this.dataNumTxt.value));
            this.switchAutoMode(false);
        });

        // データ数カウント
        for (var element of <any>this.counterBtns) {
            element.addEventListener('click', (event: HTMLElementEvent<HTMLButtonElement>) => {
                var num = Number(this.dataNumTxt.value);

                num += Number(event.target.value);

                if (num <= 1) {
                    num = 2;
                } else if (1000 < num) {
                    num = 1000;
                }

                this.dataNumTxt.value = String(num);
                window.sessionStorage.setItem(this.SESSION_SORT_DATA_NUM, String(num));

                this.reset();
            });
        }

        // 速度
        for (var speedRadio of <any>this.speedRadios) {
            speedRadio.addEventListener('change', () => {
                for (var speedRadio of <any>this.speedRadios) {

                    var radio = <HTMLInputElement>speedRadio;

                    if (radio.checked) {
                        speedRadio.parentElement.classList.add('active');
                        this.sort.setSpeed(Number(radio.value));

                        window.sessionStorage.setItem(this.SESSION_SORT_AUTO_SPEED, radio.value);
                    } else {
                        speedRadio.parentElement.classList.remove('active');
                    }
                }
            });

        }

    }


    /**
     * オートモードを切り替える
     * 
     * @param flag
     */
    private switchAutoMode(flag: boolean) {

        if (flag) {
            this.autoBtn.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i> Auto';
            this.autoBtn.value = 'off';

            for (var speedRadio of <any>this.speedRadios) {
                var radio = <HTMLInputElement>speedRadio;
                if (radio.checked) {
                    this.sort.setSpeed(Number(radio.value));
                }
            }

            this.sort.auto(true);

        } else {
            this.autoBtn.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i> Auto';
            this.autoBtn.value = 'on';
            this.sort.auto(false);
        }

    }


    /**
     * リセット
     */
    private reset() {
        this.sort.reset(Number(this.dataNumTxt.value));
        this.switchAutoMode(false);
    }

}

interface HTMLElementEvent<T extends HTMLElement> extends Event {
    target: T;
}