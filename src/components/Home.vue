<template>
    <div class="home">
        <nav-bar></nav-bar>
        <router-view class="sys-content"></router-view>
    </div>
</template>

<script>
import navBar from './SysNav.vue';

export default {
    name: 'home',
    data() {
        return {
        };
    },
    components: {
        navBar,
    },
};

</script>

<style lang="scss">
@import '../scss/common.scss';

.home {
    height: calc(100% - #{$headerh});
}

.sys-content {
    background-color: #fafafa;
    margin-left: 240px;
    margin-top: 61px;
    height: calc(100% - 9px);
    padding: 16px 22px;
    overflow: auto;
    position: relative;
}

</style>
