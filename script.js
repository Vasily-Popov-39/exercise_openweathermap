//Переменные для вывода на страницу
let temp = document.querySelector('.temp');
let feels_like = document.querySelector('.feels');
let dif = document.querySelector('.dif');
let min_dif = document.querySelector('.min_dif');
let dt = document.querySelector('.dt');
let duration = document.querySelector('.duration');
let day = document.querySelector('.day');
let city = document.querySelector('.city');
//объект со всеми ключами для запроса на openweathermap, сделал для удобства
const API = {
    "id": 554234, //id города
    "name": "Kaliningrad", //наименование города
    "key": '72505d3eef12efc551bd8c804b7e0395', //API ключ
    "lang": 'ru', // язык
    "exclude": 'minutely,hourly,current', // исключаем неиспользуеммые данные
    "units": 'metric', // формат - градусы по цельсию
    "coord": { //координаты города
        "lon": 20.51095, // Долгота
        "lat": 54.70649 //Широта
    }
}
//собираем адрес для GET запроса fetch
let url = `https://api.openweathermap.org/data/2.5/onecall?&exclude=${API.exclude}&lat=${API.coord.lat}&lon=${API.coord.lon}&lang=${API.lang}&appid=${API.key}&units=${API.units}`;

fetch(url)
    .then(response => response.json())
    .then(function (data) {
        //----------Задача №1----------------//
        let timezone = data.timezone; //получаем город
        let daily = data.daily; //массив с данным для 8 дней включая текущие
        let dif_temp = []; //разница температуры для всех дней
        for (let i = 0; i < daily.length; i++) {
            let dt1 = new Date(data.daily[i].dt * 1000).toLocaleDateString();
            dt.innerHTML += `${dt1}<br>` //вывводим дату
            temp.innerHTML += `${daily[i].temp.night}&deg<br>`; //фактическая  температура ночью
            feels_like.innerHTML += `${daily[i].feels_like.night}&deg<br>`; //ощущаемая температура ночью
            dif.innerHTML += `${Math.abs(daily[i].temp.night - daily[i].feels_like.night).toFixed(2)}&deg<br>`;
            dif_temp.push([daily[i].dt, +(Math.abs(daily[i].temp.night - daily[i].feels_like.night)).toFixed(2)])
        }

        let count = dif_temp[0][1]; //наименьшая разница температур p
        for (let i = 0; i < dif_temp.length; i++) { //перебор с сохранением наименьшего значения
            if (count > dif_temp[i][1]) {
                count = dif_temp[i][1]
            }
        }

        let result = dif_temp.filter(function (item) { //получаем запись с наименьшей разницей температур
            if (item[1] == count) {
                return item
            }
        });

        min_dif.innerHTML = `Минимальная разница температур будет:<b> ${new Date(result[0][0] * 1000).toLocaleDateString()}</b>, равной: <b>${result[0][1]}&deg;</b>`
        //----------Задача №2----------------//
        city.innerHTML += timezone; // выводим город
        let dur = []; //храним данные с датой и световым днем
        for (let i = 0; i <= 4; i++) {
            dur.push([daily[i].dt, daily[i].sunset - daily[i].sunrise])
        }
        // переводим UNIX time в часы, минуты, секунды
        for (let i = 0; i < dur.length; i++) {
            let timestamp = dur[i][1]
            let hours = Math.floor(timestamp / 60 / 60); //Получаем часы
            let minutes = Math.floor(Math.abs((timestamp / 60) - (hours * 60))); ////Получаем минуты
            let seconds = timestamp % 60 //Получаем секунды
            // приводим UNIX time в понятный формат
            let formatted = [
                hours.toString().padStart(2, '0'),
                minutes.toString().padStart(2, '0'),
                seconds.toString().padStart(2, '0')
            ].join(':');
            day.innerHTML += `${new Date(dur[i][0]*1000).toLocaleDateString()}<br>` //вывод даты
            duration.innerHTML += `${formatted}<br>` // вывод светового дня в понятном формате
        }
    });