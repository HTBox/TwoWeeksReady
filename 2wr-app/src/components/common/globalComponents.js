import Vue from 'vue';
import EditableTextBlock from './EditableTextBlock.vue';
import IconTextBlock from './IconTextBlock.vue';
import InfoBar from './InfoBar.vue';

export default function () {
  Vue.component("EditableTextBlock", EditableTextBlock);  
  Vue.component("IconTextBlock", IconTextBlock);  
  Vue.component("InfoBar", InfoBar);  
}