<template>
	<div class="goods">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 商品查询
            </BreadcrumbItem>
        </Breadcrumb>
        <Select v-model="shop" style="width:200px">
            <Option v-for="i in shops" :value="i.value" :key="i._id">{{ i.label }}</Option>
        </Select>
        <div class="input rel">
            <Input v-model.trim="keyword" placeholder="请输入商品名称" @on-enter="search" style="width: 500px; margin-right: 20px;"/>
            <Button type="primary" @click="search">查询</Button>
        </div>
        <Divider orientation="left">商品查询结果
            <label class="total" v-if="goodsLen">共{{ goodsLen }}条</label>
        </Divider>
        <div class="goods-warp rel">
            <div class="good-box rel" v-for="item in goods" :key="item._id">
                <a class="link rel" style="top: 22px;" @click="deleteOne(item._id);">删除</a>
                <div class="empty abs" v-if="item.count < 1"></div>
                <div class="good-item g-number rel">
                    <div class="tag abs">商品货号：</div>
                    <div class="content title-link rel" @click="view(item._id);">{{ item.goodId || '' }}</div>
                </div>
                <div class="good-item rel">
                    <div class="tag abs">商品名称：</div>
                    <div class="content title-link rel" @click="view(item._id);">{{ item.name || '' }}</div>
                </div>
                <div class="good-item g-number rel">
                    <div class="tag abs">吊牌价格：</div>
                    <div class="content rel"><b>¥{{ item.price || '' }}</b></div>
                </div>
                <div class="good-item g-number rel">
                    <div class="tag abs">折后价格：</div>
                    <div class="content rel"><b>¥{{ item.salePrice || '' }}</b></div>
                </div>
                <div class="good-item rel">
                    <div class="tag abs">进货渠道：</div>
                    <div class="content rel">{{ item.shop || '' }}</div>
                </div>
                <div class="good-item rel">
                    <div class="tag abs">商品库存：</div>
                    <div class="content rel">{{ item.count || 0 }}</div>
                </div>
            </div>
        </div>
	</div>
</template>

<script>
export default {
    name: 'goods',
    data() {
        return {
            shop: '全部',
            keyword: '',
            goods: [],
            shops: [],
        };
    },
    computed: {
        goodsLen() {
            return this.goods.length;
        },
    },
    methods: {
        search() {
            this.$ajax.searchGoods({
                shop: this.shop,
                keyword: this.keyword,
            }).then((rsp) => {
                this.goods = rsp.data.goods || [];
                if (!rsp.data.success) {
                    this.$Message.error(rsp.data.msg);
                }
            });
        },
        view(id) {
            window.open(`/good/${id}`);
        },
        deleteOne(id) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认删除该商品？</p>',
                onOk: () => {
                    this.$ajax.deleteGood(id).then((rsp) => {
                        this.$Message.success(rsp.data.msg);
                        if (rsp.data.success) {
                            this.search();
                        }
                    });
                },
            });
        },
    },
    created() {
        this.$ajax.getShops().then((rsp) => {
            this.shops = rsp.data.shops || [];
            this.shops.unshift({
                label: '全部',
                value: '全部',
            });
        });
        this.search();
    },
    mounted() {
        window.onbeforeunload = null;
    },
};

</script>

<style lang="scss">
.goods {
    overflow: hidden;
    .total {
        color: #f60;
        font-size: 12px;
    }
    .goods-warp {
        height: calc(100% - 156px);
        overflow-y: auto;
    }
    .input {
        margin: 50px 0 32px 239px;
    }
    .ivu-select {
        position: absolute;
        top: 87px;
        left: 37px;
    }
    .good-item {
        float: left;
        font-size: 14px;
        width: 400px;
        margin-right: 2%;
        padding-left: 81px;
        margin-bottom: 8px;
        .g-number {
            width: 270px
        }
    }
    .tag {
        top: 0;
        left: 0;
        color: #777;
    }
    b {
        color: #f60;
    }
    .good-box {
        overflow: hidden;
        border-bottom: 1px #ddd dashed;
        padding: 16px 0 12px 0;
    }
}

.title-link {
    color: #2d8cf0;
    cursor: pointer;
    &:hover {
        color: #f60;
        text-decoration: underline;
    }
}

.empty {
    background-image: url(/src/assets/imgs/empty.png);
    background-repeat: no-repeat;
    background-size: 100% auto;
    width: 115px;
    height: 60px;
    right: 27px;
    top: 10px;
}
</style>
