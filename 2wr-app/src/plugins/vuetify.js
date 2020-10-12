import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/lib/util/colors';
import VueRouter from 'vue-router'

/* HEX THEME
  
                primary: '#3f51b5',
                secondary: '#ff5722',
                accent: '#00bcd4',
                error: '#f44336',
                warning: '#ffc107',
                info:'#607d8b',
                success: '#4caf50'
*/

Vue.use(Vuetify);
Vue.use(VueRouter);

const vuetify = new Vuetify({
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: colors.indigo.base,
                secondary: colors.deepOrange.base,
                accent: colors.cyan.base,
                error: colors.red.base,
                warning: colors.amber.base,
                info: colors.blueGrey.base,
                success: colors.green.base 
            }
        }
    }
});

export default vuetify;
