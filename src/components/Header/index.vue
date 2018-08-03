<template>
  <header class="container header">
    <div class="row">
      <div class="buttons-wrapper col-sm-9">
        <button
            class="btn btn-sm btn-primary button"
            @click="showDropDown"
        >
          Добавить
        </button>
        <button class="btn btn-sm btn-primary button">
          Обновить
        </button>
      </div>
      <div class="input-group input-group-sm col-sm-3 search">
        <input
            v-model="searchWord"
            type="text"
            class="form-control search-field"
            placeholder="Событие, дата или участник"
            aria-label="Username"
            aria-describedby="inputGroup-sizing-sm"
        >
      </div>
      <a-drop-down/>
    </div>
  </header>
</template>

<script>
import { EventBus } from '../../modules/event-bus.js'
import ADropDown from '../DropDown/index.vue'
export default {
  name: 'Header',
  components: {
    ADropDown
  },
  data () {
    return {
      searchWord: ''
    }
  },
  watch: {
    searchWord () {
      EventBus.$emit('searchingStarted', this.searchWord)
    }
  },
  methods: {
    showDropDown () {
      EventBus.$emit('showDropDown', {isSearchList: false})
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../styles/custom-bootstrap.scss';
  @import '../../../node_modules/bootstrap/scss/bootstrap.scss';

  .header {
    position: relative;
    min-height: 100px;
    padding: 50px 50px 20px;
    background-color: $gray-header;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);
  }

  .button {
    margin-right: 6px;

    &:last-of-type {
      margin-right: 0;
    }
  }

  .search {
    min-width: 20%;
    padding-left: 25px;
    background: url("../../assets/search.svg") no-repeat 0 center;
    background-size: 18px;

    &-field {
      box-shadow: 0 0 5px 0 $gray-neutral inset;

      &::placeholder {
        color: $gray-neutral;
      }
    }
  }
</style>
