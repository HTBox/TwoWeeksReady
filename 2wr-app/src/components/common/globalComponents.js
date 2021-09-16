import Vue from 'vue';
import EditableTextBlock from './EditableTextBlock.vue';
import IconTextBlock from './IconTextBlock.vue';
import InfoBar from './InfoBar.vue';
import DatePickerInput from "./DatePickerInput.vue";
import SecureImg from './SecureImg.vue';
import ConfirmDialog from './ConfirmDialog.vue';

export default function () {
  Vue.component("EditableTextBlock", EditableTextBlock);  
  Vue.component("IconTextBlock", IconTextBlock);  
  Vue.component("InfoBar", InfoBar);
  Vue.component("DatePickerInput", DatePickerInput);
  Vue.component("SecureImg", SecureImg);
  Vue.component("ConfirmDialog", ConfirmDialog);
}