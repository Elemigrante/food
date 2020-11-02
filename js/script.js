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
    modal = document.querySelector('.modal');

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

  //  закрытие модального окна при клике на подложку
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
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

  const modalTimerId = setTimeout(openModal, 50000);

  // 2. Появление мод. окна, если пользователь долистал до конца страницы

  function showModalByScroll() {
    if (window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight) {
      openModal();
      window.removeEventListener('scroll', showModalByScroll); // не показываем мод. окно, если пользователь уже
      //  скролил до конца страницы
    }
  }

  window.addEventListener('scroll', showModalByScroll);

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
        element.classList.add(this.element);
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

  const getResource = async (url) => {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Couldn't fetch ${url}, status: ${res.status}`);
    }

    return await res.json();
  };

  // Получение карточек с axios
  axios.get('http://localhost:3000/menu')
    .then(data => {
      data.data.forEach(({
        img,
        altimg,
        title,
        descr,
        price
      }) => {
        new MenuCard(img, altimg, title, descr, price, '.menu .container').renderPatrial();
      });
    });

  // Forms

  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  };

  forms.forEach(item => {
    bindPostData(item);
  });

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault(); // Отмена стандартного поведения браузера с методом preventDefault()

      // Создание сообщения для пользователя 
      const statusMsg = document.createElement('img');
      statusMsg.src = message.loading;
      statusMsg.style.cssText = `
        display: block;
        margin: 0 auto;
      `;

      form.insertAdjacentElement('afterend', statusMsg);

      const formData = new FormData(form);

      // Преобразование formData  в  json
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      // Сохраняем данные из мод. окна в db.json (requests)
      postData('http://localhost:3000/requests', json)
        .then(data => {
          console.log(data);
          showThanksModal(message.success);
          statusMsg.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  // Появление нового модального окна после заполнения формы
  function showThanksModal(message) {
    const prevModalDialog = document.querySelector('.modal__dialog');
    // Скрытие предыдущего модального окна
    prevModalDialog.classList.add('hide');
    // Открытие другого
    openModal();
    // Создание нового элемента
    const thanksModal = document.createElement('div');
    thanksModal.classList.add('modal__dialog');
    thanksModal.innerHTML = `
      <div class="modal__content">
        <div class="modal__close" data-close>×</div>
        <div class="modal__title">${message}</div>
      </div>
    `;

    // Помещение элемента(блока) на страницу
    document.querySelector('.modal').append(thanksModal);
    setTimeout(() => {
      thanksModal.remove();
      prevModalDialog.classList.add('show');
      prevModalDialog.classList.remove('hide');
      closeModal();
    }, 4000);
  }

  // Slider

  const slides = document.querySelectorAll('.offer__slide'),
    prev = document.querySelector('.offer__slider-prev'),
    next = document.querySelector('.offer__slider-next'),
    total = document.querySelector('#total'),
    current = document.querySelector('#current');

  let slideIndex = 1;

  showSlides(slideIndex);

  // Количество слайдов
  if (slides.length < 10) {
    total.textContent = `0${slides.length}`;
  } else {
    total.textContent = slides.length;
  }

  // Показ слайдов
  function showSlides(i) {

    if (i > slides.length) {
      slideIndex = 1;
    }

    if (i < 1) {
      slideIndex = slides.length;
    }

    slides.forEach(item => item.style.display = 'none');
    slides[slideIndex - 1].style.display = 'block';

    // Текущий слайд
    if (slides.length < 10) {
      current.textContent = `0${slideIndex}`;
    } else {
      current.textContent = slideIndex;
    }
  }

  // Перемещение по слайдам
  function plusSlides(i) {
    showSlides(slideIndex += i);
  }

  prev.addEventListener('click', () => {
    plusSlides(-1);
  });

  next.addEventListener('click', () => {
    plusSlides(1);
  });
});