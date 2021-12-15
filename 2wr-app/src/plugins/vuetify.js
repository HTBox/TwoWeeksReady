import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import '@mdi/font/css/materialdesignicons.css';
import colors from 'vuetify/lib/util/colors';
import VueRouter from 'vue-router'

const themeColors = {
    lightOrange: "#f99b2c",
    darkOrange: "#c14d23",
    background: "#f8f1c7"
}

Vue.use(Vuetify);
Vue.use(VueRouter);

const vuetify = new Vuetify({
    icons: {
        iconfont: 'mdi'
    },
    theme: {
        themes: {
            light: {
                primary: themeColors.lightOrange,
                secondary: themeColors.darkOrange,
                accent: colors.cyan.base,
                error: colors.red.base,
                warning: colors.amber.base,
                info: colors.blueGrey.base,
                success: colors.green.base,
                background: themeColors.background
            }
        }
    }
});

export default vuetify;
