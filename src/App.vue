<template>
    <div id="app">
        <router-view name="header"></router-view>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
};

</script>

<style>
@import './scss/app.css';

</style>
