<template>
	<div class="admin" :class="{'edit': queryId}">
        <Breadcrumb>
            <BreadcrumbItem>
                <Icon type="ios-home-outline"></Icon> 首页
            </BreadcrumbItem>
            <BreadcrumbItem>
                <Icon type="logo-buffer"></Icon> {{ queryId ? '商品管理' : '入库管理' }}
            </BreadcrumbItem>
        </Breadcrumb>
        <div class="form">
            <Divider orientation="left">基本信息</Divider>
            <div class="form-item">
                <div class="tag">商家选择：</div>
                <div class="content">
                    <Select v-model="shop" :disabled="disabledEdit" style="width:200px">
                        <Option v-for="i in shops" :value="i.value" :key="i._id">{{ i.label }}</Option>
                    </Select>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">商品名称：</div>
                <div class="content">
                    <Input v-model.trim="name" :disabled="disabledEdit" placeholder="请输入商品名称"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">商品货号：</div>
                <div class="content">
                    <Input v-model.trim="goodId" :disabled="disabledEdit" placeholder="请输入商品货号"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">进货价格：</div>
                <div class="content" :class="{'hidden': !isShowPrice}" @dblclick="togglePrice">
                    <InputNumber
                        v-model.trim="prevPrice"
                        placeholder="请输入进货价格"
                        :min="0"
                        :disabled="disabledEdit"
                        @on-change="setPrevTotal"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">进货数量：</div>
                <div class="content">
                    <InputNumber v-model.trim="prevNumber" :min="0" disabled/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">进货小计：</div>
                <div class="content">
                    <InputNumber v-model.trim="prevTotal" disabled :min="0"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">吊牌价格：</div>
                <div class="content">
                    <InputNumber v-model.trim="price" :min="0" :disabled="disabledEdit" @on-change="setSalePrice" placeholder="请输入吊牌价格"/>
                </div>
            </div>
            <div class="form-item">
                <div class="tag">折后价格：</div>
                <div class="content">
                    <InputNumber v-model.trim="salePrice" :min="0" disabled placeholder="请输入折后价格"/>
                </div>
            </div>
            <div v-show="queryId" class="form-item">
                <div class="tag">实际售价：</div>
                <div class="content">
                    <Input v-model.trim="realPrice" :min="0" placeholder="请输入实际售价"/>
                </div>
            </div>
            <Divider orientation="left">颜色信息</Divider>
            <Button type="dashed" :disabled="propsLength > 4" @click="addOneColor">添加颜色</Button>
            <div class="color-warp rel" :class="{'large': queryId}">
                <div class="color-item rel" v-for="item in props" :key="item.id">
                    <!-- 添加尺码 -->
                    <a class="add-size" title="添加尺码" @click="addOneSize(item)"><Icon type="ios-add-circle" /></a>
                    <!-- 删除颜色 -->
                    <Button
                        v-if="propsLength > 1"
                        type="default"
                        title="删除颜色"
                        class="delete-color"
                        shape="circle"
                        icon="md-close"
                        @click="deleteOneColor(item);">
                    </Button>
                    <!-- 颜色 -->
                    <div class="tag title abs">颜色：</div>
                    <div class="box rel" style="width: 300px;">
                        <Input v-model.trim="item.color" placeholder="请输入颜色"/>
                    </div>
                    <!-- 尺码 -->
                    <div class="color-size rel" v-for="(s, index) in item.size" :key="index">
                        <div class="size-li rel">
                            <div class="tag abs">尺码：</div>
                            <div class="box rel">
                                <Input v-model.trim="s.value" @on-change="setPrevTotal" placeholder="请输入尺码"/>
                            </div>
                        </div>
                        <div class="size-li rel">
                            <div class="tag abs">件数：</div>
                            <div class="box rel">
                                <InputNumber v-model.trim="s.count" :min="0" @on-change="setPrevTotal" placeholder="请输入件数"/>
                            </div>
                        </div>
                        <div v-show="queryId !== ''" class="size-li rel">
                            <div class="tag abs">已售：</div>
                            <div class="box rel">
                                <InputNumber v-model.trim="s.saled" :min="0" :max="s.count" @on-change="setPrevTotal" placeholder="请输入已售件数"/>
                            </div>
                        </div>
                        <div v-if="item.size.length > 1" class="size-li rel">
                            <div class="box rel">
                                <a class="delete" @click="deleteOneSize(s, item);">删除</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Button type="primary" size="large" style="width: 100px;left: 669px;" @click="save">保存</Button>
	</div>
</template>

<script>
export default {
    name: 'admin',
    data() {
        return {
            name: '',
            goodId: '',
            prevPrice: 0,
            prevTotal: 0,
            price: 0,
            salePrice: 0,
            realPrice: 0,
            shop: '',
            shops: [],
            props: [],
            isShowPrice: false,
        };
    },
    computed: {
        queryId() {
            return this.$route.params.id || '';
        },
        disabledEdit() {
            if (!this.queryId) {
                this.clear();
                this.isShowPrice = true;
            }
            return !!this.queryId;
        },
        propsLength() {
            return this.props.length;
        },
        prevNumber() {
            return this.prevPrice ? (this.prevTotal / this.prevPrice) : 0;
        },
    },
    watch: {
        queryId: {
            immediate: true,
            handler() {
                this.getGoodInfo();
            },
        },
    },
    methods: {
        getId() {
            return new Date().getTime().toString();
        },
        togglePrice() {
            if (this.queryId) {
                this.isShowPrice = !this.isShowPrice;
            }
        },
        /**
         * 设置折后价格
         */
        setSalePrice() {
            this.salePrice = this.price / 2;
        },
        /**
         * 添加一个颜色属性
         */
        addOneColor() {
            this.props.push({
                id: this.getId(),
                color: '',
                size: [
                    {
                        value: '',
                        count: 0,
                        saled: 0,
                    },
                ],
            });
        },
        /**
         * 删除一个颜色属性
         */
        deleteOneColor(item) {
            this.$Modal.confirm({
                title: '提示',
                content: '<p>确认删除该颜色属性？</p>',
                onOk: () => {
                    this.props = _us.without(this.props, item);
                    this.setPrevTotal();
                },
            });
        },
        /**
         * 添加一个尺码属性
         */
        addOneSize(item) {
            item.size.push(
                {
                    id: this.getId(),
                    value: '',
                    count: 0,
                    saled: 0,
                }
            );
        },
        /**
         * 删除一个尺码属性
         */
        deleteOneSize(size, item) {
            item.size = _us.without(item.size, size);
            this.setPrevTotal();
        },
        /**
         * 获取提交参数
         */
        getParams() {
            const count = this.getGoodCount();
            const params = {
                name: this.name,
                goodId: this.goodId,
                prevPrice: this.prevPrice,
                prevTotal: this.prevTotal,
                price: this.price,
                salePrice: this.salePrice,
                realPrice: this.realPrice,
                props: this.props,
                shop: this.shop,
                count,
            };
            return params;
        },
        /**
         * 设置商品库存
         */
        getGoodCount() {
            let count = 0;
            for (const v of this.props) {
                for (const s of v.size) {
                    const num = s.count - (s.saled|| 0);
                    count += num < 0 ? 0 : num;
                }
            }
            return count;
        },
        /**
         * 设置进货总计
         */
        setPrevTotal() {
            let total = 0;
            for (const v of this.props) {
                for (const s of v.size) {
                    if (s.count) {
                        total += this.prevPrice * s.count;
                    }
                }
            }
            this.prevTotal = total;
        },
        /**
         * 是否存在不完整的颜色信息
         */
        hasInValidColor() {
            let flag = false;
            for (const v of this.props) {
                if (!v.color) {
                    flag = true;
                    break;
                }
            }
            return flag;
        },
        /**
         * 是否存在不完整的尺码信息
         */
        hasInValidSize() {
            let flag = false;
            for (const v of this.props) {
                if (flag) {
                    break;
                }
                for (const s of v.size) {
                    if (!s.value || !s.count) {
                        flag = true;
                        break;
                    }
                }
            }
            return flag;
        },
        /**
         * 提交
         */
        save() {
            if (!this.shop) {
                this.$Notice.warning({
                    title: '请选择一个商家',
                });
                return;
            }
            if (!this.name && !this.goodId) {
                this.$Notice.warning({
                    title: '商品名称和商品货号至少填写一个',
                });
                return;
            }
            if (this.salePrice < this.prevPrice + 10) {
                this.$Notice.warning({
                    title: '真实售卖价格不能低于“进货价格 + 10元”',
                });
                return;
            }
            if (!this.props.length || this.hasInValidColor()) {
                this.$Notice.warning({
                    title: '颜色信息不完整',
                });
                return;
            }
            if (this.hasInValidSize()) {
                this.$Notice.warning({
                    title: '尺码信息不完整',
                });
                return;
            }
            const params = this.getParams();
            if (this.queryId) { // 保存
                params._id = this.queryId;
                this.$ajax.updateGood(params).then((rsp) => {
                    if (rsp.data.success) {
                        this.$Notice.success({
                            title: '保存成功',
                        });
                    } else {
                        this.$Notice.error({
                            title: rsp.data.msg,
                        });
                    }
                });
            } else { // 添加
                this.$ajax.save(params).then((rsp) => {
                    if (rsp.data.success) {
                        this.clear();
                        this.$Notice.success({
                            title: '保存成功',
                        });
                    } else {
                        this.$Notice.error({
                            title: rsp.data.msg,
                        });
                    }
                });
            }
        },
        /**
         * 获取商品详情
         */
        getGoodInfo() {
            if (this.queryId) {
                this.$ajax.getGood(this.queryId).then((rsp) => {
                    const data = rsp.data.good || {};
                    if (rsp.data.success) {
                        this.shop = data.shop;
                        this.name = data.name;
                        this.goodId = data.goodId;
                        this.prevPrice = data.prevPrice;
                        this.price = data.price;
                        this.salePrice = data.salePrice;
                        this.realPrice = data.realPrice;
                        this.props = data.props;
                        this.setPrevTotal();
                    } else {
                        this.$Message.error(rsp.data.msg);
                    }
                });
            }
            this.isShowPrice = !this.queryId;
        },
        /**
         * 清空表单
         */
        clear() {
            this.shop = '';
            this.name = '';
            this.goodId = '';
            this.prevPrice = 0;
            this.price = 0;
            this.salePrice = 0;
            this.realPrice = 0;
            this.prevTotal = 0;
            this.props = [];
        },
    },
    created() {
        this.$ajax.getShops().then((rsp) => {
            this.shops = rsp.data.shops || [];
        });
    },
    mounted() {
        window.onbeforeunload = function () {
            return '关闭提示';
        };
        if (this.queryId) {
            window.onbeforeunload = null;
            document.getElementsByClassName('nav-guide')[0].remove();
        }
    },
};

</script>

<style lang="scss">
@import '../scss/admin.scss';

</style>
