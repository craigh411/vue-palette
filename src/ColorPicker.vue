<template>
    <div>
        <div class="text-picker">
            <input type="text" @focus="open" @blur="close" :value="hex" class="form-control">
            <color-picker-window @color-selected="setColor" :select-color="hex" @editing="setEditing" :show="showPicker"></color-picker-window>
        </div>
    </div>

</template>

<script type="text/javascript">
import ColorFactory from "../src/classes/ColorFactory.js";
import ColorPickerWindow from "../src/ColorPickerWindow.vue";
import ColorSlider from "../src/ColorSlider.vue";
import store from "./Store.js";
export default {
    components: {
        ColorPickerWindow,
        ColorSlider
    },
    provide: {
        "store": store
    },
    props: {
        startColor: {
            default: "#ff0000",
            type: String
        }
    },
    created() {
        document.addEventListener("click", () => {
            if (!this.editing && !this.isDragging) {
                this.showPicker = false;
            }
            this.isDragging = false;
        });
        this.color = ColorFactory.create(this.startColor);
    },
    methods: {
        setSliderColor(rgb, hex) {
            this.sliderColor = hex;
        },
        setColor(hex, color) {
            this.color = color;
            this.$emit("color-selected", this.color);
        },
        close() {
            if (!this.edited) {
                this.showPicker = false;
                this.color = ColorFactory.create(this.startColor);
            }
        },
        open() {
            this.edited = false;
            this.editing = true;
            this.showPicker = true;
        },
        setEditing(val) {
            this.editing = val;
            this.edited = true;
        }
    },
    computed: {
        hex() {
            return (this.color) ? this.color.hex() : "#ff0000";
        },
        dragging() {
            return store.dragging;
        }
    },
    watch: {
        dragging(isDragging) {
            if (isDragging) {
                this.isDragging = true;
            }
        }
    },
    data() {
        return {
            color: null,
            sliderColor: "#0ABAB5",
            isDragging: false,
            showPicker: false,
            editing: false,
            edited: false
        };
    }
};
</script>

<style>
.text-picker {
    position: relative;
}


.color-picker {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    background: #fff;
    border: 1px solid #999;
    padding: 5px;
    display: inline-flex;
}

.slider {
    margin-left: 5px;
}
</style>
