<template>
	<div class="nav-guide">
        <Menu theme="light" :active-name="activeName" :open-names="['1']">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-paper" />
                    菜单导航
                </template>
                <MenuItem name="admin" to="/admin">入库管理</MenuItem>
                <MenuItem name="store" to="/goods">商品查询</MenuItem>
            </Submenu>
        </Menu>
	</div>
</template>

<script>
    export default {
        name: 'sysnav',
        data() {
            return {
            };
        },
        computed: {
            activeName() {
                return this.$route.path.substring(1);
            },
        },
        methods: {
        },
        mounted() {
        }
    };

</script>

<style lang="scss">
.nav-guide {
    position: fixed;
    top: 61px;
    height: calc(100% - 61px);
    left: 0;
    .ivu-menu {
        height: 100%;
    }
}

</style>
