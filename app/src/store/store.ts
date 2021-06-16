import { makeAutoObservable } from "mobx";
import { questions } from "./data";

interface Questions {
  [key: string]: any;
}

interface Link {
  id: string,
  index: number,
}

class Store {
  questions: Questions = questions;
  shuffleQuestions:Array<any> = [];
  links: Array<Link> = [];
  score = 0;
  isCheck = false;
  isStart = false;
  isProgramScroll = true;
  time = { hours: '00', seconds: '00', minutes: '00' };
  numberQuestions = 64;
  isShowResults = false;
  date = new Date();

  constructor() {
    makeAutoObservable(this);
    this.changeMode = this.changeMode.bind(this);
    this.start = this.start.bind(this);
    this.scrollToAnswer = this.scrollToAnswer.bind(this);
    this.exit = this.exit.bind(this);
    this.changeNumberQuestions = this.changeNumberQuestions.bind(this);
    this.changeVisibleResults = this.changeVisibleResults.bind(this);
  }

  scrollToAnswer(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    let questionListElement = document.querySelector(".question-list");
    let elem = event.target as HTMLElement;
    if (document.documentElement.clientHeight < 800) {
      this.isShowResults = false;
    }
    if (elem.tagName === 'SPAN') {
      let answer = document.getElementById(`${elem.dataset.id}`);
      let top = answer?.offsetTop || 50;
      questionListElement?.scrollTo(0, top - 50);
    }
  }

  shuffle(array: Array<any>) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  newOrderQuestions() {
    this.shuffleQuestions = this.shuffle(Object.entries(this.questions));
    this.shuffleQuestions = this.shuffleQuestions.slice(0, this.numberQuestions).map((data) => { 
      data[1].answers = this.shuffle(data[1].answers);
      return data;
    });
  }

  changeMode() {
    this.isCheck = !this.isCheck;
    if (this.isCheck) {
      this.check();
    } else {
      let inputs = document.querySelectorAll('input');
      inputs.forEach((input) => { 
        input.checked = false; 
        input.value = ''; 
      });
      this.start();
    }
  }

  checkEqual(rightAnswer: Array<string>, selectAnswer: string) {
    let isRight = false;
    if (selectAnswer.length > 2) {
      isRight = !!rightAnswer.find((answer) => {
        return answer.toLowerCase().slice(0, -2) === selectAnswer.toLowerCase().trim().slice(0, answer.length - 2)
      });
    } else {
      isRight = !!rightAnswer.find((answer) => answer.toLowerCase() === selectAnswer.toLowerCase().trim());
    }
    return isRight ? 1 : 0;
  }

  collectAnswers(data: HTMLFormElement, rightAnswer: Array<string>) {
    let isRight = [];
    let formData = new FormData(data);
    for (let pair of formData.entries()) {
      let selectAnswer = `${pair[1]}`;
      isRight.push(this.checkEqual(rightAnswer, selectAnswer));
    }
    return isRight;
  }

  designationAnswer(isRight: Array<number>, id: string, rightAnswer: Array<string>, index: number) {
    if (isRight.length === rightAnswer.length && Math.min(...isRight)) {
      this.questions[id].isRight = true; 
    } else {
      this.questions[id].isRight = false; 
      this.links.push({ id, index });
    }
  }

  check() {
    this.score = 0;
    this.isShowResults = true;
    let forms = document.querySelectorAll('form');
    forms.forEach((data, index) => {
      let id = data.dataset.id || '';
      let rightAnswer = this.questions[id].rightAnswer;
      let isRight = this.collectAnswers(data, rightAnswer);
      this.designationAnswer(isRight, id, rightAnswer, index+1);
      let increaseValue = isRight.filter((value) => !!value).length / rightAnswer.length || 0;
      this.score += +increaseValue.toFixed(2);
    });
  }

  start() {
    this.isStart = true;
    this.links.length = 0;
    this.date = new Date();
    this.time = { hours: '00', seconds: '00', minutes: '00' };
    this.timer();
    this.newOrderQuestions();
  }

  exit() {
    this.isStart = false;
    this.isCheck = false;
    this.time = { hours: '00', seconds: '00', minutes: '00' };
  }

  changeTime() {
    let currentTime = new Date();
    let newTime = new Date(+currentTime - +this.date);
    this.time = {
      seconds: `0${newTime.getSeconds()}`.slice(-2),
      minutes: `0${newTime.getMinutes()}`.slice(-2),
      hours: `0${newTime.getUTCHours()}`.slice(-2),
    }
  }

  timer() {
    let interval = setInterval(() => {
      if (!this.isCheck && this.isStart) { 
        this.changeTime();
      } else {
        clearInterval(interval);
      }
    }, 1000)
  }

  changeNumberQuestions(event: { target: HTMLInputElement }) {
    this.numberQuestions = Math.max(0, Math.min(+event.target.value, 64));
  }

  changeVisibleResults() {
    this.isShowResults = !this.isShowResults;
  }
}

const store = new Store();

export default store;