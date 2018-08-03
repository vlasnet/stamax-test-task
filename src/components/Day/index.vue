<template>
  <div class="day-wrapper">
    <div class="day-date">{{preparedDate}}</div>
    <div v-if="hasEvent" class="event">
      <div class="event-title">{{this.event.title}}</div>
      <div class="event-participants">{{getParticipantsList(this.event)}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Day',
  data () {
    return {
    }
  },
  props: {
    dayName: String,
    date: String,
    event: Object
  },
  computed: {
    preparedDate () {
      return this.dayName ? `${this.dayName}, ${this.date}` : this.date
    },
    hasEvent () {
      return this.event !== null
    }
  },
  methods: {
    getParticipantsList (event) {
      return event.participants.map(item => `${item.name || ''} ${item.surname || ''}`).join(', ')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/custom-bootstrap.scss';
  @import '../../../node_modules/bootstrap/scss/bootstrap.scss';

  .day-wrapper {
    width: 100%;
    min-width: 60px;
    height: 100px;
    word-wrap: break-word;
    overflow: hidden;
  }

  .day-date {
    width: 100%;
    word-wrap: break-word;
  }

  .event {
    width: 100%;
    margin-top: 5px;
    word-wrap: inherit;

    &-title {
      font-weight: bold;
    }

    &-participants {
    }
  }
</style>
