import Vue from "vue";

var store = new Vue({
    methods: {
        updateSlider(color) {
            this.slider = color;
        },
        updateDragging(isDragging) {
            this.dragging = isDragging;
        }
    },
    data() {
        return {
            slider: "#ffffff",
            dragging: false
        };
    }
});

export default store;
