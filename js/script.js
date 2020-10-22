'use strict';

document.addEventListener('DOMContentLoaded', () => {

  // Tabs

  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContent = document.querySelectorAll('.tabcontent'),
    tabsParent = document.querySelector('.tabheader__items');

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide');
      item.classList.remove('show', 'fade');
    });

    tabs.forEach(tabItem => {
      tabItem.classList.remove('tabheader__item_active');
    });
  }

  function showTabContent(i = 0) {
    tabsContent[i].classList.add('show', 'fade');
    tabsContent[i].classList.remove('hide');
    tabs[i].classList.add('tabheader__item_active');
  }

  hideTabContent();
  showTabContent();

  tabsParent.addEventListener('click', (event) => {
    const target = event.target;

    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((item, i) => {
        if (target == item) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  // Timer

  const deadline = '2020-12-30';

  function getTimeRemaning(endtime) {
    const t = Date.parse(endtime) - Date.parse(new Date()), // получение разницы в миллисекундах
      days = Math.floor(t / (1000 * 60 * 60 * 24)), // получение количества суток до окончания deadline
      hours = Math.floor((t / (1000 * 60 * 60) % 24)), // часов до конца акции(deadline)
      minutes = Math.floor((t / 1000 / 60) % 60),
      seconds = Math.floor((t / 1000) % 60);

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
      'seconds': seconds
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  // Set timer
  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    // Update timer
    function updateClock() {
      const t = getTimeRemaning(endtime);

      days.innerHTML = getZero(t.days);
      hours.innerHTML = getZero(t.hours);
      minutes.innerHTML = getZero(t.minutes);
      seconds.innerHTML = getZero(t.seconds);

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }

  setClock('.timer', deadline);

  // Modal Window

  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal'),
    modalCloseBtn = document.querySelector('[data-close]');

  //  Функция открытия мод. окна
  function openModal() {
    modal.classList.add('show');
    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
    clearInterval(modalTimerId); // сброс интервала появления мод. окна,
    //  чтобы пользователь сам решил нужно это ему сейчас или нет
  }

  //  Функция закрытия мод. окна
  function closeModal() {
    modal.classList.add('hide');
    modal.classList.remove('show');
    document.body.style.overflow = '';
  }

  // Перебор кнопок у кого есть атрибут 'data-modal'
  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal);
  });

  //  закрытие модального окна при клике на кнопку "крестик"
  modalCloseBtn.addEventListener('click', closeModal);

  //  закрытие модального окна при клике на подложку
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  //  закрытие модального окна при нажатии на Esc
  document.addEventListener('keydown', (e) => {
    if (e.code === "Escape" && modal.classList.contains('show')) {
      closeModal();
    }
  });

  // Появление модального окна при определенных условиях

  // 1. Появление мод. окна через 10-15 сек.

  // const modalTimerId = setTimeout(openModal, 5000);

  // 2. Появление мод. окна, если пользователь долистал до конца страницы

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll); // не показываем мод. окно, если пользователь уже
      //  скролил до конца страницы
    }
  }

  // window.addEventListener('scroll', showModalByScroll);

  // Menu cards

  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.transfer = 78;
      this.classes = classes;
      this.changeToRuble();
    }

    changeToRuble() {
      this.price *= this.transfer;
    }

    renderPatrial() {
      const element = document.createElement('div');
      if (this.classes.length === 0) {
        this.element = 'menu__item'; // класс по умолчанию
        element.classList.add();
      } else {
        this.classes.forEach(className => element.classList.add(className));
      }

      element.innerHTML = `
        <img src=${this.src} alt=${this.alt}>
        <h3 class="menu__item-subtitle">${this.title}</h3>
          <div class="menu__item-descr">${this.descr}</div>
          <div class="menu__item-divider"></div>
          <div class="menu__item-price">
              <div class="menu__item-cost">Цена:</div>
              <div class="menu__item-total"><span>${this.price}</span> руб./день</div>
          </div>
      `;
      this.parent.append(element);
    }
  }

  new MenuCard(
    'img/tabs/vegy.jpg',
    'vegy',
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    5,
    '.menu .container',
    'menu__item',
    'big'
  ).renderPatrial();

  new MenuCard(
    'img/tabs/elite.jpg',
    'elite',
    'Меню "Премиум"',
    'В меню "Премиум" мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    7,
    '.menu .container',
    'menu__item',
    'big'
  ).renderPatrial();

  new MenuCard(
    'img/tabs/post.jpg',
    'post',
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    8,
    '.menu .container',
    'menu__item',
    'big'
  ).renderPatrial();

  // Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'Загрузка',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach(item => {
    postData(item);
  });

  function postData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Отмена стандартного поведения браузера с методом preventDefault()

      // Создание сообщения для пользователя 
      const statusMsg = document.createElement('div');
      statusMsg.classList.add('status');
      statusMsg.textContent = message.loading;
      form.append(statusMsg);

      const request = new XMLHttpRequest();
      request.open('POST', './server.php');

      // request.setRequestHeader('Content-Type', 'multipart/form-data');
      request.setRequestHeader('Content-Type', 'application/json');
      const formData = new FormData(form);

      const object = {};
      formData.forEach(function(value, key) {
        object[key] = value;
      });

      const json = JSON.stringify(object);

      request.send(json);

      request.addEventListener('load', () => {
        if (request.status === 200) {
          console.log(request.response);
          statusMsg.textContent = message.success;
          form.reset();
          setTimeout(() => {
            statusMsg.remove();
          }, 2000);
        } else {
          statusMsg.textContent = message.failure;
        }
      });

    });
  }
});
