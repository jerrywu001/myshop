<template>
	<div class="store">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 库存查询
            </BreadcrumbItem>
        </Breadcrumb>
	</div>
</template>

<script>
export default {
    name: 'store',
    data() {
        return {
        };
    },
    methods: {
    },
    mounted() {
        window.onbeforeunload = null;
    },
};

</script>

<style lang="scss">

</style>
