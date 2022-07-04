import DDialog from "../components/dialog/DDialog.vue";
import DCard from "../components/card/DCard.vue";
import DButton from "../components/button/DButton.vue";
import {ref} from "vue";

export default {
    title: 'DDialog',
    component: DDialog,
    argTypes: {
        label: {control: 'text'},
        color: {control: 'color'},
        outlined: {control: 'boolean'},
        glow: {control: 'boolean'},
    },
};

const Template = (args) => ({
    components: {DDialog, DCard, DButton},
    setup() {
        const value = ref(false);
        return {args, value};
    },
    template: `
      <d-button @click="value=true">open</d-button>
      <d-dialog v-bind="args" v-model="value">
      <d-card width="200px" height="200px">

      </d-card>
      </d-dialog>`,
});

export const Primary = Template.bind({});
Primary.args = {};
/*
export const Secondary = Template.bind({});
Secondary.args = {
    label: 'Secondary',
};

export const Outlined = Template.bind({});
Outlined.args = {
    label: 'Outlined',
    outlined: true
};

export const Glow = Template.bind({});
Glow.args = {
    label: 'Outlined',
    glow: true
};*/
