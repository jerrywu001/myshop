<template>
    <div class="nav-guide">
        <Menu theme="light" :active-name="activeName" :open-names="['1']">
            <Submenu name="1">
                <template slot="title">
                    <Icon type="ios-paper" />
                    菜单导航
                </template>
                <MenuItem name="admin" to="/admin">
                    入库管理
                </MenuItem>
                <MenuItem name="shops" to="/shops">
                    商家管理
                </MenuItem>
                <MenuItem name="goods" to="/goods">
                    商品查询
                </MenuItem>
            </Submenu>
        </Menu>
    </div>
</template>

<script>
export default {
    name: 'sysnav',
    computed: {
        activeName() {
            return this.$route.path.substring(1);
        },
    },
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
