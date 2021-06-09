import { makeAutoObservable } from "mobx";
import { questions } from "./data";

class Store {
  questions = questions;
  shuffleQuestions = [];
  score = 0;
  isCheck = false;

  constructor() {
    makeAutoObservable(this);
    this.selectAnswer = this.selectAnswer.bind(this);
    this.changeMode = this.changeMode.bind(this);
  }

  selectAnswer(event) {
    let elem = event.target.closest('.text_left');
    if (elem && event.detail) {
      let id = elem.dataset.id;
      let answer = elem.querySelector('label').textContent;
      this.questions[id].selectedAnswer = answer;
    }
  }

  shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  newOrderQuestions() {
    this.shuffleQuestions = this.shuffle(Object.entries(this.questions));
    this.shuffleQuestions = this.shuffleQuestions.map((data) => { 
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
      inputs.forEach((input) => input.checked = false)
      this.newOrderQuestions();
    }
  }

  check() {
    this.score = 0;
    let forms = document.querySelectorAll('form');
    forms.forEach((data) => {
      let isRight = [];
      let formData = new FormData(data);
      let id = data.dataset.id;
      let rightAnswer = this.questions[id].rightAnswer;
      for (var pair of formData.entries()) {
        if (!rightAnswer.includes(pair[1])) {
          isRight.push(false);
        } else {
          isRight.push(true);
        }
      }
      if (isRight.length === rightAnswer.length && Math.min(...isRight)) {
        this.score++;
        this.questions[id].isRight = true; 
      } else {
        this.questions[id].isRight = false; 
      }
    });
  }

  initApp() {
    this.newOrderQuestions();
  }
}

const store = new Store;
store.initApp();
export default store;