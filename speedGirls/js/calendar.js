document.addEventListener('DOMContentLoaded', function () {
    const monthYearEl = document.getElementById('month-year');
    const daysEl = document.getElementById('days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const todayMonthBtn = document.getElementById('today-btn');
    const eventPanel = document.getElementById('event-panel');
    const eventDateEl = document.getElementById('event-date');
    const eventListEl = document.getElementById('event-list');

    let currentDate = new Date();
    let selectedDate = null;

    const events = {
        '2025-9-15': [
            { time: '14:30', text: 'Aniversário do motoclube' }
        ],
        '2025-9-20': [
            { time: '11:00', text: 'São Paulo' }
        ],
        '2025-9-25': [
            { time: '21:00', text: 'Guarujá' }
        ],
        '2025-10-2': [
            { time: '15:00', text: 'Belo Horizonte' }
        ]
    };

    function renderCalendar() {


        const firstDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );

        const lastDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            0
        );

        const prevLastDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            0
        );

        const firstDayIndex = firstDay.getDay();
        const lastDayIndex = lastDay.getDay();
        const nextDays = 7 - lastDayIndex - 1;

        const month = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho",
            "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        monthYearEl.innerHTML = `${month[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

        let days = "";


        for (let x = firstDayIndex; x > 0; x--) {
            const prevDate = prevLastDay.getDate() - x + 1;


            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${prevDate}`;

            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month ${hasEvent ? 'has-events' : ''}">${prevDate}</div>`;
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                i
            );

            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${i}`;
            const hasEvent = events[dateKey] !== undefined;

            let dayClass = 'day';


            if (
                date.getDate() === new Date().getDate() &&
                date.getMonth() === new Date().getMonth() &&
                date.getFullYear() === new Date().getFullYear()
            ) {
                dayClass += ' today';
            }

            if (
                selectedDate &&
                date.getDate() === selectedDate.getDate() &&
                date.getMonth() === selectedDate.getMonth() &&
                date.getFullYear() === selectedDate.getFullYear()
            ) {
                dayClass += ' selected';
            }

            if (hasEvent) {
                dayClass += ' has-events';
            }

            days += `<div class="${dayClass}" data-date="${dateKey}">${i}</div>`;
        }


        for (let j = 1; j <= nextDays; j++) {
            const dateKey = `${currentDate.getFullYear()}-${currentDate.getMonth() + 2}-${j}`;
            const hasEvent = events[dateKey] !== undefined;

            days += `<div class="day other-month ${hasEvent ? 'has-events' : ''}">${j}</div>`;
        }

        daysEl.innerHTML = days;

        document.querySelectorAll('.day:not(.other-month)').forEach(day => {
            day.addEventListener('click', () => {

                const dateStr = day.getAttribute('data-date');
                const [year, month, dayNum] = dateStr.split('-').map(Number);

                selectedDate = new Date(year, month - 1, dayNum);

                renderCalendar();
                showEvents(dateStr);
            });
        });
    }

    function showEvents(dateStr) {
        const [year, month, day] = dateStr.split('-').map(Number);
        const dateObj = new Date(year, month - 1, day);

        const months = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];

        const daysWeek = [
            "Domingo", "Segunda-feira", "Terça-feira",
            "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sábado"
        ];

        const dayName = daysWeek[dateObj.getDay()];

        eventDateEl.textContent = `${dayName}, ${day} de ${months[dateObj.getMonth()]} de ${year}`;

        eventListEl.innerHTML = '';

        if (events[dateStr]) {
            events[dateStr].forEach(event => {
                const eventItem = document.createElement('div');
                eventItem.className = 'event-item';
                eventItem.innerHTML = `
                    <div class="event-color"></div>
                    <div class="event-time">${event.time}</div>
                    <div class="event-text">${event.text}</div>
                `;
                eventListEl.appendChild(eventItem);
            });
        } else {
            eventListEl.innerHTML = `<div class="no-events">Nenhum evento marcado</div>`;
        }
    }

    prevMonthBtn.addEventListener('click', () => {

        currentDate.setMonth(currentDate.getMonth() - 1);

        renderCalendar();

        eventDateEl.textContent = 'Selecione uma data';
        eventListEl.innerHTML = `<div class="no-events">Selecione uma data com eventos</div>`;
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);

        renderCalendar();

        eventDateEl.textContent = 'Selecione uma data';
        eventListEl.innerHTML = `<div class="no-events">Selecione uma data com eventos</div>`;
    });

    todayMonthBtn.addEventListener('click', () => {
        currentDate = new Date();
        selectedDate = new Date();

        renderCalendar();

        const dateStr = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()}`;
        showEvents(dateStr);
    });

    renderCalendar();
});
