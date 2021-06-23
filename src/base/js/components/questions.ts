/* QUESTIONS */

export const page = async () => {

    // Countdown Initialized
    Countdown.init()

    // Wizard Form Initialized
    WizardForm.init()
}

// ---------------- COUNTDOWN MODULE ----------------
const Countdown = (function () {
    let countdownClass: string = 'countdown';
    let changedVelocity: boolean = false;
    let counter = setInterval(() => 100);

    let seconds: number = 30;
    let totalTime: number = seconds * 100;
    let startTime: any = +new Date();
    let usedTime: number = 0;

    // References
    let refCountdownContainer = document.querySelector(`.${countdownClass}`);
    let refCountdownText = document.querySelector(`.${countdownClass} .${countdownClass}__text`);
    let refCountdownProgress = document.querySelector(`.${countdownClass} .${countdownClass}__progress`);

    // FUNCTIONS --------------------
    function _calculateTime(secs: number): string {
        var mi = Math.floor(secs / (60 * 100));
        var ss = Math.floor((secs - mi * 60 * 100) / 100);
        var ms = secs - Math.floor(secs / 100) * 100;

        // Coloca un cero a la izquierda si el (minuto/segundo/milisegundo) es menor a 10
        const fillZero = (time: number): string => {
            return time < 10 ? `0${time}` : `${time}`;
        }

        return `${fillZero(mi)}:${fillZero(ss)}:${fillZero(ms)}`
    }

    function _calculatePercentage(nwTime: number): number {
        return (nwTime * 100) / totalTime
    }

    function _setAudio(actionType: string = 'create') {
        let audioTag: HTMLAudioElement = document.querySelector(`.${countdownClass} .${countdownClass}__audio`)

        switch (actionType) {
            case 'create':
                let nwAudioTag = document.createElement('audio')
                nwAudioTag.src = '../audio/clock.mp3'
                nwAudioTag.classList.add(`${countdownClass}__audio`)
                nwAudioTag.loop = true;
                nwAudioTag.preload = 'metadata';
                nwAudioTag.play()
                refCountdownContainer.append(nwAudioTag)
                break;

            case 'stop':
                audioTag.pause()
                audioTag.currentTime = 0
                break;

            case 'velocity':
                audioTag.playbackRate = 3;
                break;
        }
    }

    function _updateTime(): void {

        _setAudio();
        counter = setInterval(() => {

            usedTime = Math.floor((+new Date() - startTime) / 10);
            var nwTime = totalTime - usedTime;

            let timeString: string = _calculateTime(nwTime);
            let percentage = _calculatePercentage(nwTime)

            // Updated output
            refCountdownText.innerHTML = timeString
            refCountdownProgress.setAttribute('value', `${percentage}`)

            if (nwTime <= 500 && !changedVelocity) {
                changedVelocity = true
                _setAudio('velocity')
            }
            if (nwTime <= 0) stopTimer()

        }, 30)
    }

    function stopTimer(): string {
        clearInterval(counter)
        _setAudio('stop')

        // TIEMPO USADO
        let totalTimeUsed = refCountdownText.innerHTML.includes('-') ? '00:00:00' : refCountdownText.innerHTML
        console.log('Tiempo usado:', totalTimeUsed);

        // Reset Variables
        startTime = +new Date();
        usedTime = 0;

        // Updated output
        refCountdownText.innerHTML = '00:00:00'
        refCountdownProgress.setAttribute('value', '0')

        return totalTimeUsed
    }

    function hideCounter(): void {
        refCountdownContainer.classList.add('hidden')
    }

    function init(): void {
        let timeString: string = _calculateTime(totalTime);
        refCountdownText.innerHTML = timeString

        _updateTime()
    }
    return { init, stopTimer, hideCounter }
})();

// ---------------- WIZARD FORM MODULE ----------------
const WizardForm = (function () {
    let wizardFormClass: string = 'form--wizard'
    let refWizardForm = document.getElementsByClassName(`${wizardFormClass}`);
    let outputClass: string = 'op';

    interface Option {
        text: string,
        value: string
    }
    interface Question {
        title: string,
        options: Array<Option>,
        correctOption: number
    }
    interface Quiz {
        currentAnswer?: number,
        correctAnswers?: number,
        totalQuestions: number,
        questions?: Array<Question>
        usedTime?: string,
        responses?: object,
        htmlReferences?: {
            time: HTMLElement,
            totalQuestions: HTMLElement
        }
    }

    function _setController(form: Element): void {

        let wizardQuiz: Quiz = {
            usedTime: '00:00:00',
            totalQuestions: 0,
            currentAnswer: 1,
            responses: {},
            htmlReferences: {
                'time': form.querySelector(`.${outputClass}__time`),
                'totalQuestions': form.querySelector(`.${outputClass}__total-questions`)
            }
        };

        form.addEventListener('click', function (e) {
            let refCurrentTarget = this
            let refEventTarget = e.target as HTMLElement

            // El evento se dispara doble en el (label/input) de la opcion seleccionada
            if (refEventTarget.tagName == 'INPUT') return

            // Verifica si el elemento tiene el selector recibido, si no, empieza a buscar traves de los elementos padres
            const helper = (element: any, selector: string): boolean | HTMLElement => {
                if (element != refCurrentTarget) {
                    if (element.matches(selector)) return element
                    return helper(element.parentNode, selector)
                }
                return false
            }

            let currentElement: any = helper(refEventTarget, '.form__label')

            if (currentElement) {
                // Obtiene el valor del input de la opcion escogida
                let inputRef: HTMLInputElement = currentElement.previousElementSibling || currentElement.nextElementSibling
                let responseQuestion = { [`question_${wizardQuiz.currentAnswer}`]: inputRef.value }

                // Guarda las respuestas
                wizardQuiz.responses = { ...wizardQuiz.responses, ...responseQuestion }

                // Cambia de pregunta
                let refPanel: any = helper(currentElement, '.form__panel--active')
                refPanel.classList.remove('form__panel--active')

                if (refPanel.nextElementSibling && refPanel.nextElementSibling.classList.contains('form__panel')) {
                    refPanel.nextElementSibling.classList.add('form__panel--active')
                    wizardQuiz.currentAnswer++
                }
                else {
                    // Seccion final
                    let finalMessage = refCurrentTarget.querySelector('.form__final')
                    if (finalMessage) finalMessage.classList.add('form__final--show')

                    try {
                        // Oculta el contador y lo detiene
                        Countdown.hideCounter()
                        wizardQuiz.usedTime = Countdown.stopTimer()

                        // Muestra la información en la seccion final (form__final)
                        if (wizardQuiz.htmlReferences['time']) wizardQuiz.htmlReferences['time'].innerHTML = wizardQuiz.usedTime
                        if (wizardQuiz.htmlReferences['totalQuestions']) wizardQuiz.htmlReferences['totalQuestions'].innerHTML = `${wizardQuiz.currentAnswer}`

                    } catch (error) {
                        console.log('No hay ningun contador que parar.');
                    }

                    console.log('AQUI SE PODRÁ REDIRECCIONAR/REALIZAR PETICION AJAX/');
                }

            }
        })
    }

    function init() {
        if (refWizardForm.length > 0) {
            for (let i = 0; i < refWizardForm.length; i++) {
                const wizardFormElement = refWizardForm[i];
                _setController(wizardFormElement)
            }
        }
    }

    return { init }
})();