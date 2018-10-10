<template>
	<div class="goods">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> 销售查询
            </BreadcrumbItem>
        </Breadcrumb>
        <Select v-model="shop" style="width:200px">
            <Option v-for="i in shops" :value="i.value" :key="i._id">{{ i.label }}</Option>
        </Select>
        <div class="input rel">
            <Input v-model.trim="keyword" placeholder="请输入商品名称" @on-enter="search" style="width: 500px; margin-right: 20px;"/>
            <Button type="primary" @click="search">查询</Button>
        </div>
        <Divider orientation="left">销售查询结果</Divider>
        <div class="goods-warp rel">
            <p style="font-size: 14px;">总进货额：{{ totalPrev }} 元</p>
            <p style="font-size: 14px;">总销售额：{{ total }} 元</p>
            <p style="font-size: 14px;">总盈利额：{{ totalGet }} 元</p>
            <p style="font-size: 14px;">每日盈利：{{ oneDayGet }} 元</p>
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
            shops: [],
            totalPrev: 0,
            total: 0,
            totalGet: 0,
            oneDayGet: 0,
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
                const goods = rsp.data.goods || [];
                this.getToTal(goods);
            });
        },
        /**
         * 设置商品库存
         */
        getGoodCount(good) {
            let count = 0;
            for (const v of good.props) {
                for (const s of v.size) {
                    const num = s.count || 0;
                    count += num;
                }
            }
            return count;
        },
        getToTal(goods) {
            this.totalPrev = 0;
            this.total = 0;
            this.totalGet = 0;
            for (const v of goods) {
                const sales = v.realPrice.toString().split(',');
                this.totalPrev += v.prevPrice * this.getGoodCount(v);
                for (const s of sales) {
                    if (s) {
                        const price = parseInt(s, 10);
                        if (!isNaN(price) && price > 0) {
                            this.total += price;
                            this.totalGet += price - v.prevPrice;
                        }
                    }
                }
            }
            const days = (new Date(new Date().toLocaleDateString()).getTime() - new Date("2018/09/24").getTime()) / (24 * 60 * 60 * 1000) + 1;
            this.oneDayGet = parseFloat(this.totalGet / days).toFixed(2);
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
