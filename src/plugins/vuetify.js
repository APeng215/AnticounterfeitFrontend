/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */
import { VDateInput } from 'vuetify/labs/VDateInput'

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
// Translations provided by Vuetify
import { zhHans } from 'vuetify/locale'
// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  components: {
    VDateInput,
  },
  locale: {
    locale: 'zhHans',
    messages: { zhHans },
  },
  theme: {
    defaultTheme: 'light',
  },
})
