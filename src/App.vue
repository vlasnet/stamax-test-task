<template>
  <div id="app">
    <a-header/>
    <a-calendar-field/>
  </div>
</template>

<script>
import AHeader from './components/Header/index.vue'
import ACalendarField from './components/CalendarField/index.vue'

export default {
  name: 'App',
  data () {
    return {}
  },
  components: {
    AHeader,
    ACalendarField
  }
}
</script>
<style lang="scss" scoped>
  .app {
    margin-top: 25px;
  }
</style>
