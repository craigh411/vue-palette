<template>
    <div>

        <!-- <color-slider @color-selected="setColor"></color-slider> -->
        <color-picker @color-selected="setColor" select-color="#ffdada"></color-picker>
        <div class="block" :style="{background: hex}">{{hex}}<br />{{rgb}}</div>
    </div>
</template>

<script type="text/javascript">
import ColorFactory from '../src/classes/ColorFactory.js';
import ColorPicker from '../src/ColorPicker.vue';
import ColorSlider from '../src/ColorSlider.vue';
export default {
    components: {
        ColorPicker,
        ColorSlider
    },
    created() {
        //let color = ColorFactory.create([255,0,0]);
        //console.log(color.getBrightness())
        // console.log(color.compare(ColorFactory.create([0,0,0])));
    },
    methods: {
        setSliderColor(rgb, hex) {
            this.sliderColor = hex;
        },
        setColor(hex, color) {
            this.color = color;
        }
    },
    computed: {
        hex() {
            return (this.color) ? this.color.hex() : "#ff0000";
        },
        rgb() {
            return (this.color) ? this.color.rgb() : "";
        }
    },
    data() {
        return {
            color: null,
            sliderColor: '#0ABAB5'
        }
    }
}
</script>

<style>
.block {
    width: 100px;
    height: 100px;
    border: 1px solid black;
    margin: 10px;
    float: left;
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
