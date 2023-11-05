import { makeAutoObservable } from "mobx";
import { electroPrivods } from "./electorPrivodsData";
import { TAU } from "./TAU";
import { anatomy } from "./anatomy";
import { gistology } from './gistology';
import { clinika } from './clinika';

interface Object {
  [key: string]: any;
}

interface Link {
  id: string,
  index: number,
}

// function createObj(str) {
//   let newObj = {};
//   let values = str.split(/(а\)|б\)|в\)|г\))/g).filter(x => x !== 'а)' && x !== 'б)' && x !== 'в)' && x !== 'г)').map(x => x.replaceAll(/(\t|\n)/g, '').trim());
//   newObj.question = values[0];
//   newObj.rightAnswer = [values[1]];
//   newObj.answers = values.slice(1);
//   return newObj;
// }

// o = {};
// s.split(/\d{1,3}\./g).map((x,i) => createObj(x)).filter(x => !!x.question).map((x,i) => o[i+1] = x)
let dataObj = gistology
let maxNumberQuestions = Object.entries(dataObj).length;
const defaultNumberQuestions = 60;

class Store {
  questions: Object = dataObj;
  dataQuestions = Object.entries(dataObj);
  showQuestions = this.dataQuestions.slice();
  shuffleQuestions:Array<any> = [];
  links: Array<Link> = [];
  score = 0;
  isCheck = false;
  isStart = false;
  isProgramScroll = true;
  time = { hours: '00', seconds: '00', minutes: '00' };
  numberQuestions = defaultNumberQuestions;
  maxNumberQuestions = maxNumberQuestions;
  inputNumberQuestionsValue = `${defaultNumberQuestions}`;
  isShowResults = false;
  date = new Date();
  rightAnswers: Object = {};
  options: Object = {
    'rightAnswer': { value: true, title: 'правильные ответы' },
    'answers': { value: true, title: 'неправильные ответы' }
  }
  searchText = '';
  typeQuestions: Object = {
    // 'anatomy': { value: false, title: 'Анатомия и физиология человека', data: anatomy },
    // 'electroPrivods': { value: false, title: 'Электроприводы', data: electroPrivods },
    // 'TAU': { value: false, title: 'ТАУ', data: TAU },
    gistology: { value: true, title: 'Гистологические исследования', data: gistology },
    clinika: { value: false, title: 'Общеклинические исследования', data: clinika },
  }

  constructor() {
    makeAutoObservable(this);
    this.changeMode = this.changeMode.bind(this);
    this.start = this.start.bind(this);
    this.scrollToAnswer = this.scrollToAnswer.bind(this);
    this.exit = this.exit.bind(this);
    this.changeNumberQuestions = this.changeNumberQuestions.bind(this);
    this.blurNumberQuestions = this.blurNumberQuestions.bind(this);
    this.changeVisibleResults = this.changeVisibleResults.bind(this);
    this.changeOption = this.changeOption.bind(this);
    this.changeSearchText = this.changeSearchText.bind(this);
    this.getData = this.getData.bind(this);
    this.changeTest = this.changeTest.bind(this);
    this.search = this.search.bind(this);
    this.designationAnswer = this.designationAnswer.bind(this);
    this.check = this.check.bind(this);
  }

  scrollToAnswer(event: React.MouseEvent<HTMLElement, MouseEvent>) {
    let questionListElement = document.querySelector(".question-list");
    let elem = event.target as HTMLElement;
    if (document.documentElement.clientHeight < 700) {
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
    this.shuffleQuestions = this.shuffle(this.dataQuestions);
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
      this.rightAnswers[id] = true; 
    } else {
      this.rightAnswers[id] = false; 
      this.links.push({ id, index });
    }
  }

  check() {
    this.score = 0;
    this.isShowResults = true;
    let forms = document.querySelectorAll('form');
    this.rightAnswers = {};
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
    this.inputNumberQuestionsValue = event.target.value
    if (event.target.value) {
      let checkedValue = Math.max(1, Math.min(+event.target.value, this.maxNumberQuestions));
      this.numberQuestions = checkedValue;
      this.inputNumberQuestionsValue = `${checkedValue}`;
    }
  }

  blurNumberQuestions() {
    this.inputNumberQuestionsValue = `${this.numberQuestions}`;
  }

  changeVisibleResults() {
    this.isShowResults = !this.isShowResults;
  }

  getId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
        return v.toString(16);
    });
  }

  changeOption(title: string, value: boolean) {
    this.options[title].value = value;
  }

  changeTest(title: string, value: boolean) {
    Object.keys(this.typeQuestions).forEach((key) => {
      this.typeQuestions[key].value = false;
    });
    this.typeQuestions[title].value = value;
    this.questions = this.typeQuestions[title].data;
    this.dataQuestions = Object.entries(this.questions);
    this.numberQuestions = defaultNumberQuestions;
    this.inputNumberQuestionsValue = `${defaultNumberQuestions}`;
    this.showQuestions = this.dataQuestions.slice();
    this.newOrderQuestions();
    this.maxNumberQuestions = this.dataQuestions.length;
  }

  changeWidthInput(elem: HTMLInputElement) {
    elem.style.width = '200px';
    let width = Math.min(elem.scrollWidth, document.documentElement.clientWidth / 2);
    elem.style.width = width + 'px';
  }

  search(text: string) {
    this.showQuestions = this.dataQuestions.filter((data) => data[1].question.toLowerCase().includes(text));
  }

  changeSearchText(event: { target: HTMLInputElement }) {
    let elem = event.target;
    this.searchText = elem.value;
    this.changeWidthInput(elem);
    this.search(elem.value.toLowerCase());
  }

  getData(answers: string[], rightAnswer: string[]) {
    answers = answers.length > 0 ? answers : rightAnswer;
    if (!this.options.rightAnswer.value) {
      answers = answers.filter((value) => !rightAnswer.includes(value));
    }
    if (!this.options.answers.value) {
      answers = answers.filter((value) => rightAnswer.includes(value));
    }
    return answers;
  }
}

const store = new Store();

export default store;