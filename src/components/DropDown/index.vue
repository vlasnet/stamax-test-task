<template>
  <div v-if="showDropDown" :class="setDropdownClass()" role="dialog">
    <button class="close-dropdown" @click="closePopup"></button>
    <div v-if="!isSearchList" class="dropdown-wrapper">
      <div class="input-group input-group-sm">
        <input
            v-model="newEvent"
            type="text"
            class="form-control dropdown-new-event"
            placeholder="05.08.2018, 14:00, День рождения"
            aria-label="Event"
            aria-describedby="inputGroup-sizing-sm"
        >
      </div>
      <div class="dropdown-buttons">
        <button class="button" @click="createEvent">Создать</button>
      </div>
    </div>

    <div v-if="isSearchList" class="dropdown-wrapper">
      <div
          v-for="result in resultList"
          :key="result.id"
          class="result-wrapper"
      >
        <div>{{result.title}}</div>
        <div>{{result.date}}</div>

      </div>
    </div>
  </div>
</template>

<script>
import {EventBus} from '../../modules/event-bus.js'

export default {
  name: 'DropDown',
  data () {
    return {
      newEvent: '',
      showDropDown: false,
      isSearchList: false,
      resultList: []
    }
  },
  methods: {
    closePopup () {
      this.showDropDown = false
    },
    getFormattedDate (date) {
      return date && date.split(',').length > 1
        ? date.split(',').join('-')
        : date.split('.').join('-')
    },
    createEvent () {
      const splittedData = this.newEvent.split(', ')
      const payload = {
        date: `${this.getFormattedDate(splittedData[0])} ${splittedData[1]}`,
        title: splittedData[2],
        participants: []
      }
      EventBus.$emit('createEvent', payload)
      this.closePopup()
    },
    setDropdownClass () {
      return this.isSearchList ? 'search-list' : 'dropdown'
    }
  },
  mounted () {
    EventBus.$on('showDropDown', obj => {
      this.showDropDown = true
      this.isSearchList = obj.isSearchList
      this.resultList = obj.searchedEventList
    })
  },
  destroyed () {
    EventBus.$off('showDropDown')
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/custom-bootstrap.scss';
  @import '../../../node_modules/bootstrap/scss/bootstrap.scss';

  .dropdown {
    position: absolute;
    top: 100px;
    left: 50px;
    width: 350px;
    height: 110px;
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
      top: -6px;
      left: 25px;
      background-color: #fff;
      box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.25);
      transform: rotate(45deg);
    }

    &-wrapper {
      width: 90%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    &-new-event {
      width: 85%;
      box-shadow: 0 0 5px 0 $gray-neutral inset;

      &::placeholder {
        color: $gray-neutral;
      }
    }

    &-buttons {
      width: 100%;
      margin-top: 10px;
      text-align: left;
    }
  }

  .search-list {
    position: absolute;
    top: 100px;
    right: 50px;
    width: 250px;
    min-height: 200px;
    max-height: 450px;
    padding: 5px 10px;
    z-index: 999;
    overflow: auto;
    background-color: #fff;
    box-shadow: 0 0 5px 3px rgba(0, 0, 0, 0.25);
    text-align: left;

    &::before {
      content: '';
      width: 12px;
      height: 12px;
      position: absolute;
      top: -6px;
      left: 25px;
      background-color: #fff;
      box-shadow: -2px -2px 5px 0 rgba(0, 0, 0, 0.25);
      transform: rotate(45deg);
    }

    .dropdown-wrapper {
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .result-wrapper {
      width: 100%;
      padding: 5px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.25);

      &:hover {
        background-color: #199fff;
      }
    }
  }

  .button {
    padding: 2px 8px;
    margin-right: 8px;
    background: linear-gradient(to bottom, #ffffff 0%, #ececec 100%);
    border-radius: 5px;
    font-size: 12px;
    font-weight: bolder;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .close-dropdown {
    width: 8px;
    height: 8px;
    border: none;
    background: url('../../assets/cross.svg') no-repeat center transparent;
    background-size: 8px;
  }
</style>
