<template>
    <div>
<!--         <div class="color-picker">
            <color-selector @color-selected="setColor" :spectrum="sliderColor"></color-selector>
            <span class="slider"><color-slider @color-selected="setSliderColor" :start-color="sliderColor"></color-slider></span>
        </div> -->

        <color-picker  @color-selected="setColor"></color-picker>

        <div class="block" :style="{background: color}">{{color}}</div>
    </div>
</template>

<script type="text/javascript">
import ColorPicker from '../src/ColorPicker.vue';

export default {
    components: {
        ColorPicker
    },
    methods: {
        setSliderColor(rgb, hex) {
            this.sliderColor = hex;
        },
        setColor(rgb, hex) {
            this.color = hex;
        }
    },
    data() {
        return {
            color: '#0ABAB5',
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
    display:inline-flex;
}

.slider{
	margin-left:5px;
}

</style>
