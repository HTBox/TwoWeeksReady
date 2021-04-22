import {
  nextTick
} from "@vue/composition-api";

export default function setFocusVuetify(refs, name) {
  nextTick(() => {
    var inputs = refs[name].$el.getElementsByTagName("input");
    if (inputs && inputs.length > 0) inputs[0].focus();
  });
}