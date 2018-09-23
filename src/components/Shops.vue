<template>
	<div class="sale">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 商家管理
            </BreadcrumbItem>
        </Breadcrumb>
        <div class="input rel">
            <Input v-model.trim="shopName" placeholder="请输入商家名称" style="width: 500px; margin-right: 20px;"/>
            <Button type="primary" :disabled="!shopName" @click="add">添加</Button>
        </div>
        <Divider orientation="left">商家列表</Divider>
        <div class="shops rel">
            <div class="shop-item rel" v-for="item in shops" :key="item._id">
                <i class="ivu-icon ivu-icon-md-checkmark"></i>{{ item.label }}
            </div>
        </div>
	</div>
</template>

<script>
export default {
    name: 'shops',
    data() {
        return {
            shopName: '',
            shops: [],
        };
    },
    methods: {
        add() {
            this.$ajax.addShop({
                value: this.shopName,
                label: this.shopName,
            }).then((rsp) => {
                if (rsp.data.success) {
                    this.$Message.success('添加成功');
                    this.shopName = '';
                    this.getShops();
                } else {
                    this.$Message.error(rsp.data.msg);
                }
            });
        },
        getShops() {
            this.$ajax.getShops().then((rsp) => {
                this.shops = rsp.data.shops || [];
            });
        },
    },
    created() {
        this.getShops();
    },
    mounted() {
        window.onbeforeunload = null;
    },
};

</script>

<style lang="scss">
.sale {
    .input {
        margin: 50px 0 32px 0;
    }
    .shop-item {
        font-size: 14px;
        line-height: 30px;
        margin: 8px 0;
        padding: 0 8px;
    }
    .ivu-icon {
        color: #f7b731;
        font-weight: bold;
        font-size: 18px;
        margin-right: 8px;
    }
}
</style>
