# Цифровой прорыв 2021. Кейс iherb

## Общая информация

Мы предлагаем решение за счет стимулирования мотивации пользователя позаботиться о своем здоровье. 

- Через опрос получаем понимание «что с пользователем сейчас», в момент когда он зашел в приложение. 
- Как давно он был у специалиста (врача) и выполнил ли он рекомендации.
- Если пользователь готов поделиться полученными анализами, то путем сравнения с нормой – можно выявить возможную потребность в добавках.
- Если анализов нет, просим сдать и после этого уже производить заказ

Мы предлагаем пользоваться дневником потребления витаминов
- Алгоритм определения совместимости принимаемых добавок
- Напоминание о необходимости принять добавку, в зависимости от совместимости и вида добавки 

Мы предлагаем базу знаний – гайд по особенностям, с 
рекомендациями и проверкой полученных знаний 

Мы предлагаем заказывать и покупать продукцию с помощью приложения


## Немножко про реализацию

Проект написан на **Node.JS**, для достижения быстроты работы с клиентом и возможностью выдерживать высокие нагрузки.


Для проекта написано приложение:

[https://github.com/MysticalNobody/cp_2021_iherb](https://github.com/MysticalNobody/cp_2021_iherb)

## Сборка

Для начала, необходимо скачать и установать Node.JS

http://nodejs.org

После базовой настройки для запуска необходимо выполнить следующие команды:
```
cd *project dir*

npm install

npm start
```

А также добавить переменные окружения .env
```
MONGO_URI=mongodbURL
PORT=3000
```

## Документация
[https://documenter.getpostman.com/view/13110741/TzeZD5wh](https://documenter.getpostman.com/view/13110741/TzeZD5wh)
