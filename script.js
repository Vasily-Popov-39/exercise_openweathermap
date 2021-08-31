let url = 'https://api.openweathermap.org/data/2.5/onecall?&lat=54.7065&lon=20.511&exclude={part}&lang=ru&appid=72505d3eef12efc551bd8c804b7e0395&units=metric';

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    let unix_dt = data.current.dt; //Получаем дату в формате Unix timestamp
    let localdate = new Date(unix_dt * 1000).toLocaleDateString() // Получаем текущую дату - переводим милисекунды в секунды, переводим в привычный формат DD.MM.YYYY
    let actual_temp_night = data.daily[0].temp.night //получаем фактическую температуру ночью

    document.querySelector('.city').innerText = 'Мой город: ' + `${data.timezone}`.slice(7); // Выводим наименование города
    document.querySelector('.dt').innerText = `Текущая дата: ${localdate}`; //выводим текущую дату

    let obj = []; // массив  Дата, Время, Ощущаемая температура
    for (let i = 0; i < data.hourly.length; i++) {
      let mass_time = new Date(data.hourly[i].dt * 1000).toLocaleTimeString(); //получаем время
      let temp_feels_like = data.hourly[i].feels_like //вся температура
      let forecast_dates = new Date(data.hourly[i].dt * 1000).toLocaleDateString() //прогнозные даты
      obj.push([forecast_dates, mass_time, temp_feels_like]); //заполняем массив Дата, Время, Температура
    }
    let daytemp = []; // Используется для хранения  данных (дата, время, ощущаемая температура) за каждый час текущего дня
    obj.forEach(function (item, i) {
      switch (item[0]) {
        //case '27.08.2021':
        //case '28.08.2021':
        case localdate: //выбираем только текущий день
          switch (item[1]) { // отбираем только промежуток времени с 12:00 по 18:00
            case '12:00:00':
            case '13:00:00':
            case '14:00:00':
            case '15:00:00':
            case '16:00:00':
            case '17:00:00':
            case '18:00:00':
              daytemp.push(item) //заполняем массив 
          }
      }
    })
    let restempmin = []; // хранится вся ощущаемая температуру за текущий день
    daytemp.forEach(function (item, i) {
      restempmin.push(item[2]);
    })
    let min_temp = Math.min.apply(null, restempmin)
    document.querySelector('.t_day').innerHTML = `Дневная,минимальная, ощущаемая температура за <u>${localdate}</u>: <b>${min_temp}&deg;</b>`; //выводим минимальную температуру
    document.querySelector('.t_night_fact').innerHTML = `Фактическая температура ночью: <b>${actual_temp_night}&deg;</b>`;

    let dif_temp = actual_temp_night - min_temp; //Хранится разница температур
    document.querySelector('.dif_temp').innerHTML = `Разница температур: <b>${Math.abs(dif_temp).toFixed(2)}&deg;</b>`; //приводим разницу температуры по модулю, оставлям 2 знака после запятой

    let dt = []; //Дата
    let sunset = []; //рассвет
    let sunrise = []; //закат
    let res = []; //световой день
    for (let i = 0; i <= 4; i++) { //получаем первые 5 дней, включая текущий.
      let five_day = data.daily[i];
      sunrise.push(five_day.sunrise); //рассвет
      sunset.push(five_day.sunset); //закат
      dt.push(five_day.dt) // дата 
    }
    for (let i = 0; i <= sunset.length - 1; i++) { // Вычитание времени: закат-рассвет Unix timestamp
      res.push(sunset[i] - sunrise[i]); //заполняем массив данными о времени светового дня
    }

    let date_DayLightHours = []; // время в нормальном виде
    for (let i = 0; i < res.length; i++) {
      //переводим секунды в часы, минуты и секунды
      let timestamp = res[i];
      let hours = Math.floor(timestamp / 60 / 60); //Получаем часы
      let minutes = Math.floor(Math.abs((timestamp / 60) - (hours * 60))); ////Получаем минуты
      let seconds = timestamp % 60 //Получаем секунды
      //вывод в удобный формат 
      let formatted = [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].join(':');
      date_DayLightHours.push(formatted) //наполняем массив временем
    }
    let dt_dlh = []; //массив с данными - дата и световой день
    for (let i = 0; i < dt.length; i++) {
      let b = new Date(dt[i] * 1000).toLocaleDateString();
      dt_dlh.push([b, date_DayLightHours[i]]) // объединяю дату и время в единый массив
    }
    for (let i = 0; i < dt_dlh.length; i++) { //выводи на страницу Дата Долгота дня
      document.querySelector('.duration').innerHTML += `${dt_dlh[i][0] }----${dt_dlh[i][1]} <br> <br> `;
    }
  });