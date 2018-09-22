<template>
	<div class="sale">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 销售查询
            </BreadcrumbItem>
        </Breadcrumb>
	</div>
</template>

<script>
export default {
    name: 'sale',
    data() {
        return {
        };
    },
    methods: {
    },
    created() {
    },
    mounted() {
        window.onbeforeunload = null;
    },
};

</script>

<style lang="scss">

</style>
