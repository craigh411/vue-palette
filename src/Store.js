import Vue from 'vue';

var store = new Vue({
    methods: {
        updateSlider(color) {
            this.slider = color;
        },
        updateDragging(isDragging) {
           this.dragging = isDragging;
        },
        updateColor(color){

        }
    },
    data() {
        return {
            slider: '#ffffff',
            dragging: false,
            color: '#ffffff'
        }
    }
});

export default store;
