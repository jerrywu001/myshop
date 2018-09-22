<template>
	<div class="sale">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 商品查询
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 详情
            </BreadcrumbItem>
        </Breadcrumb>
	</div>
</template>

<script>
export default {
    name: 'detail',
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
