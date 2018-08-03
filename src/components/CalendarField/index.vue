<template>
  <section class="container calendar">
    <div class="row">
      <div class="col-sm-12 calendar-header">
        <button class="btn btn-sm btn-outline-secondary button arrow-left" @click="getPreviousMonth"/>
        <span class="month">
          {{month}} {{currentYear}}
        </span>
        <button class="btn btn-sm btn-outline-secondary button arrow-right" @click="getNextMonth"/>
        <button class="btn btn-sm btn-outline-secondary button" @click="setCurrentMonth(today)">
          Сегодня
        </button>
      </div>
    </div>
    <table class="table calendar-body">
      <tr
        v-for="(week, weekRow) in showingMonth"
        :key="JSON.stringify(week)"
      >
        <td
          v-for="(day, dayColumn) in week"
          class="week-day"
          :key="day.id"
          :class="highlightDay (day)"
          @click="showPopupWindow (day, weekRow, dayColumn, getEventForDate(getFullDate(day)))"
        >
          <a-day
            :date="day.date.toString()"
            :dayName="day.dayName"
            :event="getEventForDate(getFullDate(day))"
          />
        </td>
      </tr>
    </table>
    <a-popup></a-popup>
  </section>
</template>

<script>
import ADay from '../Day/index.vue'
import APopup from '../Popup/index.vue'
import {v4} from 'uuid'
import {base, getEventsByMonth, getFilteredEvents} from '../../server/index'
import {EventBus} from '../../modules/event-bus.js'

export default {
  name: 'CalendarField',
  data () {
    return {
      currentMonth: null,
      currentYear: null,
      monthDictionary: {
        0: 'Январь',
        1: 'Февраль',
        2: 'Март',
        3: 'Апрель',
        4: 'Май',
        5: 'Июнь',
        6: 'Июль',
        7: 'Август',
        8: 'Сентябрь',
        9: 'Октябрь',
        10: 'Ноябрь',
        11: 'Декабрь'
      },
      weekDays: {
        1: 'Понедельник',
        2: 'Вторник',
        3: 'Среда',
        4: 'Четверг',
        5: 'Пятница',
        6: 'Суббота',
        0: 'Воскресенье'
      },
      initialMonth: {
        0: [{}, {}, {}, {}, {}, {}, {}],
        1: [{}, {}, {}, {}, {}, {}, {}],
        2: [{}, {}, {}, {}, {}, {}, {}],
        3: [{}, {}, {}, {}, {}, {}, {}],
        4: [{}, {}, {}, {}, {}, {}, {}],
        5: [{}, {}, {}, {}, {}, {}, {}]
      },
      showingMonth: {},
      eventsList: [],
      searchedEventList: [],
      database: null
    }
  },
  components: {
    ADay,
    APopup
  },
  computed: {
    today () {
      let today = new Date(Date.now())
      return today
    },
    month () {
      return this.monthDictionary[this.currentMonth] || ''
    }
  },
  watch: {
    currentMonth () {
      const changedDate = new Date(this.currentYear, this.currentMonth, 1)
      this.getMonth(changedDate)
      localStorage.setItem('savedDate', JSON.stringify({date: changedDate}))
    },
    database () {
      const changedDate = new Date(this.currentYear, this.currentMonth, 1)
      this.getMonth(changedDate)
    }
  },
  methods: {
    calculateNewDate (startDate, daysAmount) {
      return new Date(startDate.setDate(startDate.getDate() + daysAmount))
    },
    prepareCalendar (startDate) {
      const month = startDate.getMonth()
      const year = startDate.getFullYear()
      const firstDayOfMonth = new Date(year, month, 1)
      let dayNumber = firstDayOfMonth.getDay()
      let daysBeforeFirstDay = 0
      switch (dayNumber) {
        case 0:
          daysBeforeFirstDay = -6
          break
        case 1:
          break
        default:
          daysBeforeFirstDay = 1 - dayNumber
      }
      let lastDayBeforeCalendar = this.calculateNewDate(firstDayOfMonth, daysBeforeFirstDay - 1)
      this.showingMonth = {...this.initialMonth}
      for (let week in this.initialMonth) {
        let dayOnWeek = new Date(lastDayBeforeCalendar.getFullYear(), lastDayBeforeCalendar.getMonth(), lastDayBeforeCalendar.getDate())
        Date(dayOnWeek.setDate(dayOnWeek.getDate() + Number(week) * 7))
        this.showingMonth[week] = this.showingMonth[week].map(item => {
          dayOnWeek = new Date(dayOnWeek.setDate(dayOnWeek.getDate() + 1))
          return !Number(week)
            ? {
              ...item,
              dayName: this.weekDays[dayOnWeek.getDay()],
              date: dayOnWeek.getDate(),
              month: dayOnWeek.getMonth(),
              year: dayOnWeek.getFullYear(),
              week,
              id: v4()
            }
            : {
              ...item,
              dayName: '',
              date: dayOnWeek.getDate(),
              month: dayOnWeek.getMonth(),
              year: dayOnWeek.getFullYear(),
              week,
              id: v4()
            }
        })
      }
    },
    initialLoading () {
      const savedDate = localStorage.getItem('savedDate')
      const date = savedDate
        ? new Date(JSON.parse(savedDate).date)
        : this.today
      this.setCurrentMonth(date)
    },
    getMonth (date) {
      this.prepareCalendar(date)
      this.eventsList = getEventsByMonth(this.database, this.currentMonth, this.currentYear)
    },
    getPreviousMonth () {
      if (Number(this.currentMonth) === 0) {
        this.currentMonth = 11
        this.currentYear = this.currentYear - 1
        return
      }
      this.currentMonth = this.currentMonth - 1
      this.closePopupWindow()
    },
    getNextMonth () {
      if (Number(this.currentMonth) === 11) {
        this.currentMonth = 0
        this.currentYear = this.currentYear + 1
        return
      }
      this.currentMonth = this.currentMonth + 1
      this.closePopupWindow()
    },
    setCurrentMonth (date) {
      this.currentMonth = date.getMonth()
      this.currentYear = date.getFullYear()
    },
    getShortDate (day) {
      return `${day.getDate()}-${day.getMonth()}-${day.getFullYear()}`
    },
    highlightToday (week, id) {
      const currentDay = this.showingMonth[Number(week)].find(day => day.id === id)
      let currentDate = `${currentDay.date}-${currentDay.month}-${currentDay.year}`
      return currentDate === this.getShortDate(this.today)
        ? 'is-today'
        : ''
    },
    getFullDate (day) {
      const date = day.date < 10 ? `0${day.date}` : day.date
      const month = day.month + 1 < 10 ? `0${day.month + 1}` : day.month + 1
      return `${date}-${month}-${day.year}`
    },
    getEventForDate (date) {
      const event = this.eventsList.find(event => event.date.includes(date))
      return event || null
    },
    highlightEventDay (event) {
      return event !== null ? 'event-day' : ''
    },
    highlightDay (day) {
      return [
        this.highlightToday(day.week, day.id),
        this.highlightEventDay(this.getEventForDate(this.getFullDate(day)))
      ].join(' ')
    },
    showPopupWindow (day, weekRow, dayColumn, event) {
      const calendarWidth = document.querySelector('.calendar-body').offsetWidth
      const calendarHeight = document.querySelector('.calendar-body').offsetHeight
      const left = calendarWidth / 7 * (dayColumn + 1) + 55
      const top = calendarHeight / 6 * weekRow + 60
      EventBus.$emit('showPopup', day, event, top, left)
    },
    closePopupWindow () {
      EventBus.$emit('closePopup')
    },
    deleteEvent (id) {
      this.database = {...this.database, events: this.database.events.filter(element => element.id !== id)}
    },
    updateEvent (newEvent) {
      this.database = {
        ...this.database,
        events: [
          ...this.database.events.filter(event => event.id !== newEvent.id), newEvent
        ]
      }
    },
    createEvent (newEvent) {
      newEvent = {...newEvent, id: v4()}
      this.database = {...this.database, events: [...this.database.events, newEvent]}
    }
  },
  mounted () {
    this.database = {...base, events: base.events.map(item => ({...item}))}
    this.initialLoading()
    EventBus.$on('searchingStarted', searchWord => {
      this.searchedEventList = getFilteredEvents(this.database, searchWord)
      EventBus.$emit('showDropDown', {isSearchList: true, searchedEventList: this.searchedEventList})
    })
    EventBus.$on('deleteEvent', id => this.deleteEvent(id))
    EventBus.$on('updateEvent', newEvent => this.updateEvent(newEvent))
    EventBus.$on('createEvent', newEvent => this.createEvent(newEvent))
  },
  destroyed () {
    EventBus.$off('searchingStarted')
    EventBus.$off('updateEvent')
    EventBus.$off('createEvent')
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/custom-bootstrap.scss';
  @import '../../../node_modules/bootstrap/scss/bootstrap.scss';

  .calendar {
    padding: 0 50px;
    position: relative;

    &-header {
      padding-top: 15px;
      padding-bottom: 15px;
    }

    &-body {
      width: 100%;
      margin: 0 auto;
      border: 1px solid $gray-light;
      border-collapse: collapse;
      font-size: 14px;
    }
  }

  .button {
    min-width: 25px;
    height: 25px;
    padding: 0 4px;
    margin-right: 8px;
    color: #000;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .arrow {
    &-left {
      background: url("../../assets/arrow-left.svg") no-repeat center;
      background-size: 10px;
    }
    &-right {
      background: url("../../assets/arrow-right.svg") no-repeat center;
      background-size: 10px;
    }
  }

  .month {
    display: inline-block;
    width: 120px;
    text-align: center;
  }

  .week-day {
    width: calc(100% / 7);
    height: 120px;
    border: 1px solid $gray-light;
    word-wrap: break-word;
  }

  .is-today {
    background-color: $gray-light;
  }

  .event-day {
    background-color: $skyBlue;
  }
</style>
