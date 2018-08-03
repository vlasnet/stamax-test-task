<template>
  <div
      v-show="showPopup"
      class="popup"
      :style="{
        position: 'absolute',
        top: `${this.top}px`,
        left:`${this.left}px`
      }"
      role="dialog">
    <button class="close-popup" @click="closePopup"></button>
    <div class="popup-wrapper">
      <div class="input-group input-group-sm">
        <input
            v-model="newEvent.title"
            type="text"
            class="form-control popup-title"
            placeholder="Событие"
            aria-label="Event"
            aria-describedby="inputGroup-sizing-sm"
        >
      </div>
      <div class="input-group input-group-sm">
        <input
            v-model="newEvent.date"
            type="text"
            class="form-control popup-date"
            placeholder="День, месяц, год"
            aria-label="Date"
            aria-describedby="inputGroup-sizing-sm"
        >
      </div>
      <div class="input-group input-group-sm">
        <input
            v-model="newEvent.participants"
            type="text"
            class="form-control popup-participants"
            placeholder="Имена участников"
            aria-label="Participants"
            aria-describedby="inputGroup-sizing-sm"
        >
      </div>
      <div class="input-group input-group-sm">
      <textarea rows="6"
                v-model="newEvent.description"
                class="form-control popup-description"
                placeholder="Описание"
                aria-label="Description"
                aria-describedby="inputGroup-sizing-sm"
      ></textarea>
      </div>
      <div class="popup-buttons">
        <button class="button" @click="updateEvent">Готово</button>
        <button class="button" @click="deleteSelectedEvent">Удалить</button>
      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from '../../modules/event-bus.js'

export default {
  name: 'Popup',
  data () {
    return {
      initialEvent: {
        title: '',
        date: '',
        participants: null,
        description: ''
      },
      newEvent: [],
      showPopup: false,
      day: null,
      eventId: '',
      top: '',
      left: ''
    }
  },
  methods: {
    closePopup () {
      this.showPopup = false
    },
    setEventData (event) {
      this.newEvent = {...this.initialEvent}
      if (event) {
        const {id, title, date, participants, description} = event
        this.eventId = id
        this.newEvent = {
          ...this.newEvent,
          id: event.id,
          title,
          date,
          description,
          participants: participants.map(participant => `${participant.name || ''} ${participant.surname || ''}`).join(', ')
        }
      }
    },
    getFormattedDate (date) {
      return date && date.split(',').length > 1
        ? date.split(',').join('-')
        : date.split('.').join('-')
    },
    getHandlingParticipants (participants) {
      return participants
        ? participants.split(', ').map(item => ({
          name: item.split(' ')[0],
          surname: item.split(' ')[1]
        }))
        : []
    },
    updateEvent () {
      this.newEvent = {
        ...this.newEvent,
        date: this.getFormattedDate(this.newEvent.date),
        participants: this.getHandlingParticipants(this.newEvent.participants)
      }
      this.newEvent.id
        ? EventBus.$emit('updateEvent', this.newEvent)
        : EventBus.$emit('createEvent', this.newEvent)
      this.closePopup()
    },
    deleteSelectedEvent () {
      EventBus.$emit('deleteEvent', this.eventId)
      this.closePopup()
    }
  },
  mounted () {
    EventBus.$on('showPopup', (day, event, top, left) => {
      this.showPopup = true
      this.day = day
      this.top = top
      this.left = left
      this.setEventData(event)
    })
    EventBus.$on('closePopup', () => this.closePopup())
  },
  destroyed () {
    EventBus.$off('showPopup')
    EventBus.$off('closePopup')
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/custom-bootstrap.scss';
  @import '../../../node_modules/bootstrap/scss/bootstrap.scss';

  .popup {
    position: absolute;
    width: 300px;
    height: 370px;
    padding: 5px 10px;
    z-index: 999;
    background-color: #fff;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.25);
    text-align: right;

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      position: absolute;
      top: 25px;
      left: -6px;
      background-color: #fff;
      box-shadow: -2px 2px 5px 0 rgba(0, 0, 0, 0.25);
      transform: rotate(45deg);
    }

    &-wrapper {
      width: 90%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-title {
      width: 85%;
      box-shadow: 0 0 5px 0 $gray-neutral inset;

      &::placeholder {
        color: $gray-neutral;
      }
    }

    &-date {
      width: 85%;
      margin-top: 5px;
      box-shadow: 0 0 5px 0 $gray-neutral inset;

      &::placeholder {
        color: $gray-neutral;
      }
    }

    &-participants {
      width: 85%;
      margin-top: 5px;
      box-shadow: 0 0 5px 0 $gray-neutral inset;

      &::placeholder {
        color: $gray-neutral;
      }
    }

    &-description {
      width: 85%;
      margin-top: 35px;
      box-shadow: 0 0 5px 0 $gray-neutral inset;

      &::placeholder {
        color: $gray-neutral;
      }
    }

    &-buttons {
      width: 100%;
      margin-top: 25px;
      text-align: left;
    }
  }

  .button {
    padding: 2px 8px;
    margin-right: 8px;
    background: linear-gradient(to bottom, #ffffff 0%,#ececec 100%);
    border-radius: 5px;
    font-size: 12px;
    font-weight: bolder;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .close-popup {
    width: 8px;
    height: 8px;
    border: none;
    background: url('../../assets/cross.svg') no-repeat center transparent;
    background-size: 8px;
  }
</style>
